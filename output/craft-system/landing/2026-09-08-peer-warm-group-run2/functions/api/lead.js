/*
 * קליטת ליד מטופס דף הנחיתה, ודחיפה לאיירטייבל.
 *
 * Cloudflare Pages Function. הנתיב נגזר ממיקום הקובץ: functions/api/lead.js
 * מתורגם ל-POST /api/lead באותו דומיין שבו יושב הדף.
 *
 * שלושה משתני סביבה, כולם מוגדרים בקלאודפלייר ואף אחד מהם אינו בריפו:
 *
 *   AIRTABLE_TOKEN     Personal Access Token עם הרשאת data.records:write על הבסיס.
 *                      זה סוד. הוא מוגדר כ-Secret בקלאודפלייר, לא כמשתנה רגיל.
 *   AIRTABLE_BASE_ID   מזהה הבסיס, מתחיל ב-app
 *   AIRTABLE_TABLE     שם הטבלה או מזהה הטבלה, מתחיל ב-tbl
 *
 * הטוקן לעולם אינו מגיע לדפדפן. הדף מדבר עם הפונקציה, והפונקציה מדברת עם איירטייבל.
 * זה כל ההבדל בין זה לבין קריאה ישירה לאיירטייבל מהדף, ובגללו לא עושים את השנייה.
 */

/*
 * מיפוי השדות. השמאלי הוא מה שהדף שולח, הימני הוא שם העמודה באיירטייבל.
 * זה המקום היחיד לשנות בו אם העמודות אצלך נקראות אחרת.
 * שם עמודה שלא קיים בטבלה יחזיר 422 מאיירטייבל, והדף יראה מצב שגיאה. זה תקין.
 */
const FIELDS = {
  name: 'שם',
  phone: 'טלפון',
  field: 'תחום עבודה',
  source: 'מקור'
};

/* תקרת אורך לכל ערך. לא ולידציה, אלא חסם על שדה שמישהו ידביק לתוכו טקסט ענק. */
const MAX_LEN = 300;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function clean(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_LEN);
}

export async function onRequest({ request, env }) {
  /*
   * מטפל יחיד לכל השיטות, ולא onRequestPost לצד onRequest.
   * שני מטפלים באותו קובץ מייצרים שאלה של קדימות שאין סיבה להיכנס אליה.
   * סורק שיפתח את הכתובת בדפדפן יקבל 405 ברור ולא שגיאה מוזרה.
   */
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { 'Allow': 'POST' }
    });
  }

  /* הגדרה חסרה היא שגיאת שרת, ולא ליד שנזרק בשקט.
     הדף יציג את מצב השגיאה עם דלת המילוט לוואטסאפ, וזה עדיף על הצלחה מזויפת. */
  if (!env.AIRTABLE_TOKEN || !env.AIRTABLE_BASE_ID || !env.AIRTABLE_TABLE) {
    console.error('lead: missing Airtable configuration');
    return json(500, { ok: false });
  }

  let payload;
  try {
    payload = await request.json();
  } catch (err) {
    return json(400, { ok: false });
  }

  const name = clean(payload && payload.name);
  const phone = clean(payload && payload.phone);
  const field = clean(payload && payload.field);
  const source = clean(payload && payload.source);

  /* אותה דרישה בדיוק שהדף אוכף אצלו. נאכפת שוב כאן,
     כי ולידציה בדפדפן היא נוחות למשתמש ולא שער. */
  if (!name || !phone || !field) {
    return json(400, { ok: false });
  }

  const fields = {};
  fields[FIELDS.name] = name;
  fields[FIELDS.phone] = phone;
  fields[FIELDS.field] = field;
  if (source) fields[FIELDS.source] = source;

  const url = 'https://api.airtable.com/v0/' +
    encodeURIComponent(env.AIRTABLE_BASE_ID) + '/' +
    encodeURIComponent(env.AIRTABLE_TABLE);

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.AIRTABLE_TOKEN,
        'Content-Type': 'application/json'
      },
      /* typecast מאפשר לאיירטייבל להמיר טקסט לערך של single select
         במקום לדחות את הרשומה. בלעדיו עמודת "תחום עבודה" מסוג בחירה תיכשל. */
      body: JSON.stringify({ fields, typecast: true })
    });
  } catch (err) {
    console.error('lead: airtable unreachable', err);
    return json(502, { ok: false });
  }

  if (!response.ok) {
    /* הטקסט של איירטייבל נכתב ללוג ולא חוזר לדפדפן.
       הוא מכיל שמות עמודות ומבנה בסיס, ואין סיבה לפרסם אותם. */
    const detail = await response.text().catch(function () { return ''; });
    console.error('lead: airtable rejected', response.status, detail);
    return json(502, { ok: false });
  }

  return json(200, { ok: true });
}
