/*
 * קליטת ליד מטופס דף הנחיתה ומטופס האתר, ודחיפה לאיירטייבל.
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
 *
 * השמות תואמים לטבלת clients בבסיס craft & system, שנקראה ב-2026-09-17.
 * "מה הפרוייקט?" הוא שדה ההודעה החופשית, והוא היה שם עוד לפני שהיה טופס בקוד.
 */
const FIELDS = {
  name: 'שם לקוח',
  phone: 'טלפון',
  email: 'אימייל',
  field: 'תחום עבודה',
  message: 'מה הפרוייקט?',
  source: 'מקור'
};

/* תקרת אורך. לא ולידציה, אלא חסם על שדה שמישהו ידביק לתוכו טקסט ענק.
   להודעה תקרה נפרדת וגבוהה: שדה טקסט חופשי שנחתך ב-300 תווים
   מאבד את החצי השני של מה שהפונה כתב, וזה בדיוק החלק שמסביר מה הוא צריך. */
const MAX_LEN = 300;
const MAX_LEN_MESSAGE = 2000;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function clean(value, maxLen) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen || MAX_LEN);
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
  const email = clean(payload && payload.email);
  const field = clean(payload && payload.field);
  const message = clean(payload && payload.message, MAX_LEN_MESSAGE);
  const source = clean(payload && payload.source);

  /*
   * חובה: שם וטלפון בלבד.
   *
   * זה השתנה ב-2026-09-17, ובכוונה. שני טפסים שונים מזינים את הפונקציה הזו:
   * דף הנחיתה שואל תחום עבודה, וטופס האתר שואל אימייל והודעה במקומו.
   * דרישה של "תחום עבודה" היתה מפילה ב-400 כל פנייה שמגיעה מהאתר.
   *
   * כל טופס אוכף אצלו בדפדפן את מה שהוא עצמו דורש. האכיפה כאן היא השער,
   * וולידציה בדפדפן היא נוחות למשתמש ולא תחליף לה.
   */
  if (!name || !phone) {
    return json(400, { ok: false });
  }

  const fields = {};
  fields[FIELDS.name] = name;
  fields[FIELDS.phone] = phone;
  if (email) fields[FIELDS.email] = email;
  if (field) fields[FIELDS.field] = field;
  if (message) fields[FIELDS.message] = message;
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
         במקום לדחות את הרשומה. בלעדיו עמודת "מקור" תיכשל,
         והוא גם מה שמאפשר לטלפון מסוג Phone number לקלוט מחרוזת. */
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
