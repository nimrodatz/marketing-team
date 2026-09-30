# זיכרון החיפושים: באים בטוב

> כל חיפוש נרשם כאן, **entry חדש בראש**, גם כשהוא נכשל. לפני חיפוש חדש מריצים `Grep` על הקובץ.
> התאמה מ-30 הימים האחרונים: משתמשים בקיים. **נושא דינמי** (עלויות פרסום, מחירי מתחרים, מבצעים,
> שער מטבע) מחפשים מחדש.

---

## 2026-09-30 | מבנה אתר: canonical, קישורים פנימיים, תמונות, מהירות, נתונים מובנים למאמר, דף 404 | ערוצים
**מילות מפתח:** canonical, internal links, קישורים פנימיים, anchor text, FAQ rich results, FAQPage, breadcrumbs, Article schema, image SEO, srcset, Core Web Vitals, LCP, 404.html, soft 404, Cloudflare Pages, מבנה אתר, דף שירות
**שאילתות:** "Google Search Central FAQ rich results limited to government health sites FAQPage change", "Google Search Central consolidate duplicate URLs rel canonical guidelines", "Google Search Central link best practices crawlable links anchor text internal links", "Google Search Central image SEO best practices lazy loading responsive images srcset". בנוסף WebFetch ישיר על דף ה-Article, Core Web Vitals, Cloudflare Pages ושגיאות HTTP, ובדיקה של האתר החי
**חיפוש חוזר:** לא. ה-entry הקודם של SEO עסק ב-Search Console, ב-LocalBusiness ובחוק הפרגולות. הפעם: מבנה ודפים
**מקורות:**
- [Google, documentation updates](https://developers.google.com/search/updates) - איכות: גבוהה - FAQ rich result לא מוצג מ-2026-05-07. פירורי לחם רק בדסקטופ מינואר 2025. **התאריכים בסיכום של הכלי יצאו פעם אחת משובשים, ונבדקו בקריאה שנייה**
- [Google, canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) - איכות: גבוהה (2026-07-10) - רמז חזק, כתובת מלאה, עקביות עם מפת האתר
- [Google, links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) - איכות: גבוהה (2025-12-10) - כל דף חשוב מקושר מדף אחר
- [Google, images](https://developers.google.com/search/docs/appearance/google-images) - איכות: גבוהה (2026-03-02) - רקע CSS לא מאונדקס, שם קובץ תיאורי
- [Google, Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) - איכות: גבוהה (2025-12-10)
- [Google, Article](https://developers.google.com/search/docs/appearance/structured-data/article) - איכות: גבוהה (2026-09-08) - אין שדות חובה
- [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/) - איכות: גבוהה (2026-04-21) - בלי 404.html כל כתובת מחזירה את `/`
- [Google, HTTP errors](https://developers.google.com/search/docs/crawling-indexing/http-network-errors) - איכות: גבוהה, אבל הדף מזכיר soft 404 רק בקצרה
- האתר החי, `baimbetov.me/this-page-does-not-exist-2026/` ו-`/assets/js/consent.js` - איכות: גבוהה (תצפית) - שניהם החזירו את דף הבית
- techwyse, searchenginejournal, searchengineland, inblog, almcorp, seranking, imagify, yoast, link-assistant ואחרים - איכות: נמוכה-בינונית - **לא נקראו**, המקורות הראשוניים מספיקים
**מסקנה:** אין צורך בסימון FAQ בדפים חדשים. כל דף חדש: canonical מלא, במפת האתר, מקושר מדף אחר בטקסט שמתאר אותו. חסר `404.html`, וקוד המדידה לא עלה לאוויר.
**קובץ:** `google-faq-rich-results-deprecation.md`, `google-canonical-consolidate.md`, `google-link-best-practices.md`, `google-image-seo.md`, `google-core-web-vitals.md`, `google-article-structured-data.md`, `cloudflare-pages-spa-404.md`, `site-structure-audit-2026-09-30.md`
---

## 2026-09-30 | מדידה באתר: אירועים מרכזיים ב-GA4, והסכמה לעוגיות בישראל | מדידה
**מילות מפתח:** GA4, key events, אירוע מרכזי, generate_lead, תיקון 13, עוגיות, cookies, הסכמה, opt-in, הרשות להגנת הפרטיות, באנר
**שאילתות:** "GA4 key events mark event as key event generate_lead recommended events help", "תיקון 13 חוק הגנת הפרטיות עוגיות אתרים הרשות להגנת הפרטיות הנחיה", "gov.il הרשות להגנת הפרטיות גיליון עמדה עוגיות cookies אתר אינטרנט הסכמה". בנוסף קריאה מקומית של `consent.js` ו-`privacy/index.html` בריפו
**חיפוש חוזר:** לא. ה-entry של 2026-09-29 על מדידה עסק במה שמטא וגוגל אדס דורשים, לא ב-GA4 ולא בחוק
**מקורות:**
- [Analytics Help 12966437](https://support.google.com/analytics/answer/12966437?hl=en) - איכות: גבוהה - הגדרת אירוע מרכזי, חל על נתונים חדשים בלבד
- [law.co.il](https://www.law.co.il/news/2020/11/05/israeli-privacy-regulator-recommends-cookies-consent/) - איכות: בינונית (משרד עורכי דין, 2020) - המלצת opt-in של הרשות, לא מחייבת
- [gov.il, גילוי דעת על הסכמה](https://www.gov.il/he/pages/consent-2026) - **נכשל**: 403. לא לנסות שוב ב-WebFetch
- tabnav, divinesites, brn, digita, web-a, webwecan, suls, a-2-z ואחרים - איכות: נמוכה (בוני אתרים וסוכנויות, טענות סותרות) - **לא נקראו, לא נכנסו**
- easyinsights, lovesdata, stape, analyticsmania - איכות: נמוכה-בינונית - **לא נקראו**
**מסקנה:** קוד המדידה והבאנר כבר כתובים בריפו, עם מזהים ריקים. חסרים מזהים, העלאה, וסימון שני האירועים ב-GA4. **החובה החוקית לבאנר לא אומתה ממקור ראשוני.**
**קובץ:** `ga4-key-events.md`, `israel-cookie-consent-secondary.md`, `site-structure-audit-2026-09-30.md`
---

## 2026-09-30 | מבנה האתרים של מתחרים, ודף בית שממיר | מתחרים
**מילות מפתח:** מבנה אתר מתחרים, ניווט, דף שירות, בלוג, דף עבודות, homepage, דף הבית, NN/g, Nielsen Norman
**שאילתות:** "Nielsen Norman Group homepage design guidelines communicate who you are what you do top of page". בנוסף WebFetch על דפי הבית של שלושה מתחרים מ-`competitors.md`
**חיפוש חוזר:** לא. ה-entry של 2026-09-29 קרא את דפי הפרגולה של המתחרים למיצוב ולמחיר, לא את מבנה האתר
**מקורות:**
- [אביב פרגולות](https://aviv-pergola.co.il/) - איכות: גבוהה (אתר המתחרה) - 15 דפי שירות, בלוג, פרויקטים, המלצות
- [עץ ופלא](https://etzvapele.co.il/) - איכות: גבוהה - 10 דפי שירות, בלוג, גלריה, דפי אזור, המלצות
- [MyWood](https://my-wood.co.il/) - איכות: גבוהה - 7 דפי שירות, בלוג
- [NN/g, 5 Principles](https://www.nngroup.com/articles/homepage-design-principles/) - איכות: גבוהה (מחקר שימושיות, 2024-03-15, לא ענפי) - דף הבית כנתב, דוגמאות אמיתיות
- designprinciplesftw, principles.design, webtechs, fountn - איכות: נמוכה - **לא נקראו**
**מסקנה:** כל שלושת המתחרים הם מרכז עם דף לכל שירות, בלוג ודף עבודות. **לא נמצא נתון שמשווה סדרי סקשנים בדף בית של עסק בנייה.**
**קובץ:** `competitors.md` (סעיף "מבנה האתרים שלהם"), `nngroup-homepage-principles.md`
---

## 2026-09-30 | חיפוש AI: מאיפה ChatGPT, Gemini ו-AI Overviews לוקחים המלצות על עסקים מקומיים | ערוצים
**מילות מפתח:** AI Overviews, AI Mode, ChatGPT search, Gemini, Perplexity, OAI-SearchBot, GEO, llms.txt, citations, Foursquare, Bing Places, חיפוש AI
**שאילתות:** "Google Search Central AI features and your website AI Overviews AI Mode how to appear", "ChatGPT search local business recommendations data sources Bing Foursquare study 2025", "BrightLocal study AI search local business recommendations sources ChatGPT Gemini Perplexity citations 2025", "OpenAI help ChatGPT search how it works third-party search providers OAI-SearchBot publishers appear", "Bing Places for Business supported countries Israel"
**מקורות:**
- [Google, AI features](https://developers.google.com/search/docs/appearance/ai-features) - איכות: גבוהה (2025-12-10) - אין דרישות מיוחדות, אין קבצי AI
- [OpenAI, crawlers](https://developers.openai.com/api/docs/bots) - איכות: גבוהה - OAI-SearchBot נדרש להופעה
- [BrightLocal, AI ו-listings](https://www.brightlocal.com/blog/ai-search-using-listings-sources/) - איכות: בינונית (2025-07-22, 20 חיפושים, ארה"ב) - אתרים 58% מהמקורות של ChatGPT
- [BrightLocal, LCRS AI](https://www.brightlocal.com/research/lcrs-ai-trust/) - איכות: בינונית-גבוהה (2026-03-10, 1,002 מבוגרים, ארה"ב) - 45% השתמשו ב-AI להמלצה מקומית
- [Steady Demand](https://www.steadydemand.com/chatgpts-local-results-arent-coming-from-foursquare-and-probably-never-really-were/) - איכות: בינונית (2026-08-21, 2,880 פרומפטים) - הטענה על Foursquare לא מחזיקה
- [Bing Places, עזרה](https://www.bing.com/forbusiness/help?setlang=en) - **נכשל**: הדף החזיר רק "Search". **תמיכה בישראל לא אומתה.** לא לנסות שוב ב-WebFetch
- agenceminimal, localfalcon, pagetraffic, superprompt, cited.so, surfacelocal, vyzz, localdominator, beancount, natlawreview - איכות: נמוכה (סוכנויות ומוכרי כלים) - **לא נקראו, לא נכנסו**
**מסקנה:** אין עבודה נפרדת ל-AI. אותם יסודות: אתר עם טקסט ברור, פרופיל מלא, ביקורות, רישום עקבי. מקורות ישראליים שמודלים קוראים: **לא נמצא.**
**קובץ:** `google-ai-features-site-owners.md`, `openai-crawlers-chatgpt-search.md`, `brightlocal-ai-search-local-sources-2025.md`, `steadydemand-chatgpt-foursquare-2026.md`
---

## 2026-09-30 | SEO לאתר: Search Console, נתונים מובנים, חוק הפרגולות | ערוצים
**מילות מפתח:** SEO, Search Console, sitemap, indexing, אינדקס, schema, LocalBusiness, structured data, נתונים מובנים, חוק הפרגולות, היתר לפרגולה, פטור
**שאילתות:** "Google Search Central SEO starter guide local business structured data LocalBusiness", "פרגולה מעץ היתר פטור תקנות מה צריך לדעת לפני שבונים". בנוסף: קריאה מקומית של `sitemap.xml`, `robots.txt` ו-`index.html` בריפו של האתר
**מקורות:**
- [Google, SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) - איכות: גבוהה (2025-12-10) - שעות עד חודשים, E-E-A-T לא גורם דירוג
- [Google, LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business) - איכות: גבוהה - חובה שם וכתובת, אין הנחיה לעסק שירות
- [architecture.org.il](https://architecture.org.il/%D7%97%D7%95%D7%A7-%D7%94%D7%A4%D7%A8%D7%92%D7%95%D7%9C%D7%95%D7%AA-%D7%AA%D7%99%D7%A7%D7%95%D7%9F-101-%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%9E%D7%A2%D7%95%D7%93%D7%9B%D7%9F-%D7%9C%D7%A2%D7%91%D7%95/) - איכות: בינונית-נמוכה (אתר פרטי, בלי קישור רשמי) - 50 מ"ר, הודעה תוך 45 יום עם אישור קונסטרוקטור. **לא אומת במקור רשמי**
- pushleads, redsharkdigital, agencyanalytics, localo, tovtoda, pergola-o, habone, weizmann, hazongroup, technokoluzi ואחרים - איכות: נמוכה או מתחרים - **לא נקראו**
- הריפו של האתר - איכות: גבוהה - `/pergola/` לא במפת האתר, בלי canonical ובלי קישור מדף הבית
**מסקנה:** לדומיין חדש, 4 שבועות הם אינדקס וחשיפות ראשונות, לא לידים. "חוק הפרגולות" הוא נושא חיפוש חוזר, והנוסח הרשמי עוד לא נקרא.
**קובץ:** `google-seo-starter-guide.md`, `google-localbusiness-structured-data.md`, `pergola-permit-exemption-secondary.md`, `site-seo-audit-2026-09-30.md`
---

## 2026-09-30 | קבוצות מקומיות בפייסבוק ובוואטסאפ | ערוצים
**מילות מפתח:** Facebook groups, קבוצות פייסבוק, קבוצות שכונתיות, המלצות מקומיות, פוסט בקבוצה, local groups
**שאילתות:** "Facebook groups rules promotional posts businesses group admin \"recommendations\" local community groups Meta Help", "קבוצות פייסבוק שכונתיות המלצות על בעלי מקצוע מחקר ישראל"
**מקורות:**
- [Meta, Pages, Groups and Events Policies](https://www.facebook.com/policies_center/pages_groups_events) - איכות: גבוהה (הפלטפורמה) - אין כלל כללי על פוסט של עסק בקבוצה, מנהל הקבוצה קובע
- groupboss, multiplegroupposter, fbgroupbulkposter, hootsuite - איכות: נמוכה (כלים לפרסום המוני, בלי מקור) - **לא נקראו, לא נכנסו**
- askpavel, stra, natural-poster, finder ואחרים בעברית - איכות: נמוכה - **לא נקראו**. אין בהם מחקר
**מסקנה:** **לא נמצא נתון על מה שקבוצות מקומיות מביאות.** הכללים נקבעים בכל קבוצה.
**קובץ:** `meta-pages-groups-policy.md`
---

## 2026-09-30 | הפרופיל בגוגל: ביקורות, פוסטים, שאלות ותשובות, שירותים, אזור שירות, מדדים | ערוצים
**מילות מפתח:** Google posts, פוסטים, Q&A, שאלות ותשובות, review policy, מדיניות ביקורות, incentives, תמריץ, services, שירותים, service area, אזור שירות, hide address, performance, insights, מדדים
**שאילתות:** "Google Business Profile Help create posts on your Business Profile", "Google Business Profile Q&A questions and answers discontinued 2025", "Google Maps user contributed content policy fake engagement reviews incentives selectively solicit positive reviews", "Google Business Profile Help service-area business hide address service area ranking", "Google Business Profile Help performance metrics calls website clicks searches \"Business Profile performance\""
**חיפוש חוזר:** לא. ה-entries הקודמים עסקו בדירוג הכללי (7091) ובקטגוריות. דף Whitespark 2026 נקרא שוב, לגורמים אחרים באותו דף.
**מקורות:**
- [GBP Help 7342169, פוסטים](https://support.google.com/business/answer/7342169?hl=en) - איכות: גבוהה - אין טענה על השפעה על דירוג, ארכיון אחרי חצי שנה
- [Google for Developers, Q&A API](https://developers.google.com/my-business/content/qanda/change-log) - איכות: גבוהה - הממשק הופסק ב-2025-11-03. הסרת הסקשן הציבורי רק מבלוגים של סוכנויות, **לא נכנסה כעובדה**
- [Maps policy 7400114](https://support.google.com/contributionpolicy/answer/7400114?hl=en), [16597558](https://support.google.com/contributionpolicy/answer/16597558?hl=en-GB), [GBP Help 3474122](https://support.google.com/business/answer/3474122?hl=en) - איכות: גבוהה - בלי תמריץ, בלי סינון, בלי לחץ
- [Whitespark 2026](https://whitespark.ca/local-search-ranking-factors/) - איכות: בינונית-גבוהה (סקר מומחים) - ביקורות ושירותים גבוה, פוסטים ו-Q&A נמוך
- [Whitespark, כתובת מוסתרת](https://whitespark.ca/blog/should-service-area-businesses-show-or-hide-their-address-for-local-seo/) - איכות: בינונית (מומחה, 2024-10-28) - אזור שירות לא משפיע על דירוג
- [GBP Help 9918094, מדדים](https://support.google.com/business/answer/9918094?hl=en) - איכות: גבוהה - מדד החיפושים חודשי
- ppc.land, stanventures, applausehq, wiserreview, rankai, localfalcon, brightlocal ועוד - איכות: נמוכה-בינונית - **לא נקראו**, המקורות הראשוניים מספיקים
**מסקנה:** ביקורות בקצב קבוע ושירותים בפרופיל שווים זמן. פוסטים מעט, שאלות ותשובות לא. אזור השירות לא מזיז דירוג.
**קובץ:** `google-maps-review-policy.md`, `google-business-profile-posts-help.md`, `gbp-qa-deprecation.md`, `whitespark-service-area-address-2024.md`, `google-business-profile-performance-metrics.md`, תוספת ב-`whitespark-local-ranking-factors-2026.md`
---

## 2026-09-30 | קטגוריה ראשית בפרופיל העסקי בגוגל (gbp-primary-category) | ערוצים
**מילות מפתח:** primary category, קטגוריה ראשית, Carport and pergola builder, Gazebo builder, בונה ביתנים, גזיבו, Deck builder, בונה דקים, נגר, קבלן, reverification, אימות מחדש
**שאילתות:** "Google Business Profile Help choose business category primary category", "Google Business Profile category list \"pergola\" category gazebo builder deck builder", "\"Carport and pergola builder\" gcid", "Google business categories list Hebrew translation \"בונה דקים\"", "\"פרגולות\" קטגוריה גוגל עסקי \"בונה\" סככות חניה ופרגולות", "\"בונה סככות חניה ופרגולות\" OR ...", "\"בונה ביתנים (גזיבו)\" פרגולות", "Whitespark local search ranking factors primary category ...", "changing primary category Google Business Profile suspension reverification ..."
**חיפוש חוזר:** לא. ה-entry של 2026-09-29 על הפרופיל עסק בדירוג הכללי, לא בקטגוריות.
**מקורות:**
- [GBP Help 7249669, אנגלית ועברית](https://support.google.com/business/answer/7249669?hl=iw) - איכות: גבוהה - קטגוריות משפיעות על הדירוג, עריכה עלולה לדרוש אימות מחדש, אין קטגוריה מותאמת
- [GBP Help 3038177](https://support.google.com/business/answer/3038177?hl=en) - איכות: גבוהה - "IS a" ולא "HAS a", כמה שפחות קטגוריות, אסור למלא את השם במילים
- [Dalton Luka](https://daltonluka.com/blog/google-my-business-categories) (2026-05-09) ו-[Seoteric](https://www.seoteric.com/complete-list-of-google-business-profile-categories-2024-updated/) - איכות: בינונית (רשימות סוכנות, ארה"ב) - "Carport and pergola builder" קיימת
- [Sterling Sky, שינויי קטגוריות](https://www.sterlingsky.ca/google-my-business-category-changes/) - איכות: בינונית-גבוהה - הרשימה משתנה ממדינה למדינה
- [Whitespark 2026](https://whitespark.ca/local-search-ranking-factors/) - איכות: בינונית-גבוהה (סקר מומחים) - קטגוריה ראשית מקום 1, נוספות מקום 8
- [Sterling Sky, השעיות](https://www.sterlingsky.ca/top-reasons-google-my-business-suspended-your-listing/) - איכות: בינונית-גבוהה - לא לרכז עריכות
- [pleper.com, כלי קטגוריות בעברית](https://pleper.com/index.php?do=tools&sdo=gmb_categories&lang=iw) - **נכשל**: נטען ב-JavaScript. לא לנסות שוב ב-WebFetch
- [Google Maps, "פרגולות עץ"](https://www.google.com/maps/search/%D7%A4%D7%A8%D7%92%D7%95%D7%9C%D7%95%D7%AA+%D7%A2%D7%A5?hl=iw) - **נכשל**: נטען ב-JavaScript, אין רשימת עסקים. הקטגוריה של מתחרים **לא נבדקה**. לא לנסות שוב ב-WebFetch
- gtstu, reinstatelabs, renewlocal, birdeye (ירידה של "שבוע-שבועיים" אחרי שינוי) - איכות: נמוכה, בלי מקור - **לא נקראו, לא נכנסו**
**מסקנה:** יש קטגוריה באנגלית עם המילה פרגולה, "Carport and pergola builder". **הזמינות שלה בישראל והתווית העברית: לא נמצאו.** הקטגוריה הראשית של מתחרים: לא נצפתה.
**קובץ:** `google-business-profile-categories-help.md`, `gbp-category-list-pergola.md`, `whitespark-local-ranking-factors-2026.md`, `sterlingsky-gbp-suspension-edits.md`
---

## 2026-09-30 | תנאי השובר של גוגל אדס מהלינק של נימרוד | ערוצים
**מילות מפתח:** שובר, voucher, incentives, s500g500, promotional credit, תנאים
**שאילתות:** אין WebSearch. WebFetch ישיר על הלינק שנימרוד שלח, בשלוש גרסאות, ועל דף התנאים הסטטי
**חיפוש חוזר:** נושא דינמי (מבצע), והפעם יש לינק לתנאים של השובר עצמו, שלא היה ב-entries של 2026-09-29.
**מקורות:**
- [הלינק של נימרוד, iw_il](https://ads.google.com/intl/iw_il/home/terms-and-conditions/incentives/?bc=IL&bid=s500g500%7Cib:6653296821%7C) - **נכשל**: התוכן נטען ב-JavaScript, חזרה הודעת "משהו השתבש". גם `hl=en`, `en_il` ו-`en_us` בלי פרמטרים נכשלו. לא לנסות שוב ב-WebFetch
- [Google Ads, תנאי שוברים](https://www.google.com/ads/coupons/terms.html) - איכות: גבוהה (הפלטפורמה עצמה, ישראל) - נקרא. תנאים כלליים, **בלי סכום**
**מסקנה:** קוד תוך 14 יום מהחשיפה הראשונה, זיכוי תוך 35 יום, תוקף זיכוי 60 יום, **תוקף המבצע 3 חודשים מההנפקה או תאריך שעל השובר.** הסכומים ו-s500g500 לא אומתו.
**קובץ:** `clients/baimbetov/research/google-ads-voucher-terms-il.md`
---

## 2026-09-29 | שיעור סגירה מליד לעבודה | ערוצים
**מילות מפתח:** close rate, closing rate, lead to sale, שיעור סגירה, ליד לעבודה
**שאילתות:** "contractor lead to sale close rate home improvement leads benchmark survey 2025"
**מקורות:**
- [WebFX](https://www.webfx.com/blog/home-services/home-services-marketing-benchmarks/) - איכות: בינונית-נמוכה (סוכנות, ארה"ב, 2025-09-16) - 7.8% בכל הענף, 12-15% בשירותים דחופים. ההגדרה לא חדה
- hookagency, webrunnermedia, homeguru, estatehub ואחרים - איכות: נמוכה (בלוגים של סוכנויות בלי מקור לנתון) - **לא נקראו, לא נכנסו**
**מסקנה:** אין נתון טוב. 7.8% משמש רק כעוגן לתרחיש הפסימי. **שיעור הסגירה של באים בטוב הוא החלטה/נתון של נימרוד.**
**קובץ:** `webfx-home-services-benchmarks-2025.md`
---

## 2026-09-29 | איך בעלי בתים בוחרים איש מקצוע: המלצות וביקורות | ביקוש
**מילות מפתח:** referral, word of mouth, recommendations, Houzz, הפניות, המלצה, מפה לאוזן
**שאילתות:** "Houzz study homeowners find hire professionals referral friends family percentage"
**מקורות:**
- [Houzz Pro, What Homeowners Want](https://pro.houzz.com/pro-learn/blog/what-homeowners-want-from-design-and-building-pros) - איכות: בינונית (סקר של הפלטפורמה, 2022, ארה"ב, מטבח ואמבטיה) - 62% המלצות וביקורות יחד, מעל 60% בודקים ברשת גם אחרי המלצה
- [Houzz Pro, 9 Key Takeaways 2022](https://pro.houzz.com/pro-learn/blog/9-key-takeaways-from-the-2022-houzz--home-study) - **נכשל לצורך הזה**: הדף לא מכיל נתון על איך מוצאים איש מקצוע. ה-52%/58% מהתקציר לא נמצא
**מסקנה:** המלצה וביקורת עובדות יחד. נתון ישן ומחו"ל, כיוון בלבד.
**קובץ:** `houzz-what-homeowners-want-2022.md`
---

## 2026-09-29 | פרופיל עסקי בגוגל: מה משפיע על הדירוג המקומי | ערוצים
**מילות מפתח:** Google Business Profile, GBP, local ranking, פרופיל עסקי, גוגל מפות, ביקורות, דירוג מקומי
**שאילתות:** "Google Business Profile Help improve your local ranking relevance distance prominence reviews"
**מקורות:**
- [Google Business Profile Help, 7091](https://support.google.com/business/answer/7091?hl=en) - איכות: גבוהה - רלוונטיות, מרחק, בולטות. ביקורות משפיעות. אי אפשר לשלם על דירוג
- searchenginejournal, cc94, merchynt ועוד - איכות: נמוכה-בינונית - **לא נקראו**, המקור הראשוני מספיק
**מסקנה:** הפרופיל הוא הערוץ החינמי הפעיל, והביקורות הן מה שגוגל עצמו מציין.
**קובץ:** `google-business-profile-local-ranking.md`
---

## 2026-09-29 | שובר 1,500 ₪ בישראל, ותקציב יומי בגוגל | ערוצים
**מילות מפתח:** שובר, קופון, 1500, promotional credit, daily budget, תקציב יומי, overdelivery, תקציב מינימלי
**שאילתות:** "גוגל אדס מפרסמים חדשים הוציאו 1,500 ₪ קבלו קרדיט תנאים"
**חיפוש חוזר:** נושא דינמי (מבצע), והשאלה החדשה צריכה את התנאים הספציפיים של השובר בשקלים, שלא נקראו ב-entry הקודם.
**מקורות:**
- [Netolink](https://netolink.co.il/google-ads-coupon/) - איכות: נמוכה (סוכנות שמשווקת שוברים) - נקרא. **הדף לא מכיל את תנאי ה-1,500 ₪**, רק דוגמה בדולרים. הטענה מתקציר החיפוש ("הוצאה של 400-1,500 ₪ פותחת שובר של 400") **לא נמצאה בדף ולא נכנסה**
- tomahawk, digirussian, pixellents, toplink - איכות: נמוכה (משווקי שוברים) - **לא נקראו**
- [Google Ads Help, 2375420](https://support.google.com/google-ads/answer/2375420?hl=en) - **נכשל לצורך הזה**: אין בו מידע על פי 2 ועל תקרה חודשית
- [Google Ads Help, 2375423](https://support.google.com/google-ads/answer/2375423?hl=en) - איכות: גבוהה - עד פי 2 ביום, עד פי 30.4 בחודש, בלי מינימום מוצהר
**מסקנה:** **התנאים של השובר הספציפי עדיין לא ידועים**, ונשארים בדיקה של נימרוד. תקציב יומי הוא ממוצע, וההוצאה בפועל יכולה להיות נמוכה ממנו.
**קובץ:** `google-ads-daily-budget-overdelivery.md`
---

## 2026-09-29 | מטא: האם צריך עמוד פייסבוק, ותקציב מינימלי | ערוצים
**מילות מפתח:** Facebook Page, עמוד פייסבוק, Business Portfolio, Business Manager, ad account, חשבון מודעות, Instagram boost, קידום פוסט, minimum daily budget, תקציב מינימלי מטא
**שאילתות:** "Meta Business Help do I need a Facebook Page to run ads on Instagram", "help.instagram.com boost post without Facebook Page professional account ad account", "Meta business portfolio ad account Facebook Page required to advertise ...", "developers.facebook.com marketing api Instagram ads \"Facebook Page\" required ...", "Meta ads minimum daily budget requirements Business Help Center"
**מקורות:**
- [Meta for Developers, Instagram Ads Get Started](https://developers.facebook.com/docs/marketing-api/guides/instagramads/get-started) - איכות: גבוהה - מודעה רק באינסטגרם צריכה מזהה אינסטגרם **ומזהה עמוד פייסבוק**
- [Meta for Developers, Instagram Ads API](https://developers.facebook.com/docs/marketing-api/guides/instagramads/) - **נכשל**: דף ניווט בלבד
- מרכז העזרה של מטא, `272348126756182` ו-`720478807965744` - **נכשל**: כותרת בלבד. `1010682245633077` - **נכשל**: 404. **לא לנסות שוב ב-WebFetch**
- מרכז העזרה של אינסטגרם, `1338916436473267` ו-`2090822074310288` - **נכשל**: דף ריק. הטענה שאפשר לקדם פוסט בפעם הראשונה בלי עמוד **לא נקראה**
- תקציב מינימלי במטא: רק אגרגטורים ובלוגים (stackmatix, cropink, coinis ועוד) - איכות: נמוכה - **לא נקראו, לא נכנסו**
**מסקנה:** במנהל המודעות צריך עמוד פייסבוק גם למודעה שרצה רק באינסטגרם. Business Portfolio ותקציב מינימלי: **לא אומתו ממקור ראשוני.**
**קובץ:** `meta-instagram-ads-page-requirement.md`
---

## 2026-09-29 | מה מותקן באתר, ומה מטא וגוגל דורשים | מדידה
**מילות מפתח:** pixel, GA4, gtag, fbclid, gclid, conversion tracking, instant form, click to WhatsApp, פיקסל, מדידה, המרות
**שאילתות:** "Meta Business Help lead ads instant form no pixel required", "Meta ads that click to WhatsApp Business Help Center conversations objective", "Google Ads Help set up conversion tracking website Maximize conversions requires conversion tracking"
**מקורות:**
- הריפו של האתר, `C:\my projects\baimbetov\` (Grep מקומי) - איכות: גבוהה - **אין** `gtag`, `googletagmanager` או `fbq` באף קובץ. דף `pergola/index.html` שולח עם כל ליד `utm_source/medium/campaign/content/term`, `gclid` ו-`fbclid`, ורושם לחיצת וואטסאפ ב-`/api/whatsapp-click` לטבלה "לחיצות וואטסאפ" (כפתור, UTM, דף מקור)
- [Google Ads Help, web conversions](https://support.google.com/google-ads/answer/16560108?hl=en) - איכות: גבוהה - טופס ולחיצה על כפתור יכולים להיות המרה. Smart Bidding נשען על אותות המרה
- [Google Ads Help, 6167168](https://support.google.com/google-ads/answer/6167168?hl=en) - איכות: לא רלוונטי - הדף עוסק רק באפליקציות. **נכשל לצורך הזה**
- [Meta, Lead Ads](https://www.facebook.com/business/ads/ad-objectives/lead-generation) - איכות: גבוהה - instant form ו-web form, Lead Center, חיבור CRM
- [Meta, Click to Message](https://www.facebook.com/business/ads/click-to-message-ads) - איכות: גבוהה - לחיצה פותחת שיחה, בלי דרישת אתר
- [WhatsApp Business](https://whatsappbusiness.com/products/ads-that-click-to-whatsapp/) - איכות: גבוהה - מדידה דרך פיקסל, CAPI או אופליין
- מרכז העזרה של מטא (`facebook.com/business/help/761812391313386`, `.../397336587121938`) - **נכשל**: הדף חזר עם כותרת בלבד. לא לנסות שוב ב-WebFetch
**מסקנה:** אין פיקסל ואין תג גוגל, אבל **כבר יש ייחוס מצד ראשון באיירטייבל** (UTM ומזהי קליק בלידים ובלחיצות וואטסאפ). חסר: אותות המרה לפלטפורמות, כדי שהן ילמדו.
**קובץ:** `google-ads-web-conversions.md`, `meta-lead-and-message-ads.md`
---

## 2026-09-29 | ערוצים נוספים: Local Services Ads ומידרג | ערוצים
**מילות מפתח:** Local Services Ads, LSA, מידרג, midrag, אינדקס בעלי מקצוע
**שאילתות:** "Local Services Ads available countries list Google Ads Help", "מידרג פרגולות בעלי מקצוע הצטרפות עלות"
**מקורות:**
- [Google Local Services Help](https://support.google.com/localservices/answer/6224841?hl=en-EN&co=GENIE.CountryCode%3DUS) - איכות: גבוהה - ישראל לא ברשימת המדינות
- [מידרג, הצטרפות](https://biz.midrag.co.il/Content/Article/14450) - איכות: גבוהה (הפלטפורמה עצמה) - עמלה על עסקה סגורה בלבד, 15 חשבוניות לקבלה, ציון מעל 9. אחוז העמלה לא מופיע
- [מידרג, פרגולות](https://www.midrag.co.il/Content/Tip/720) - איכות: גבוהה - קיימת קטגוריה, דירוגים 9.59-9.97
**מסקנה:** LSA לא זמין בישראל. מידרג אפשרי, אבל תנאי הכניסה (15 חשבוניות) כנראה לא מתקיים לעסק חדש. החלטה של נימרוד.
**קובץ:** `local-services-ads-availability.md`, `midrag-pro-terms.md`
---

## 2026-09-29 | שער דולר לשקל | ערוצים
**מילות מפתח:** שער יציג, דולר, USD ILS
**שאילתות:** "שער יציג דולר בנק ישראל ספטמבר 2026"
**מקורות:**
- [Investing.com](https://il.investing.com/indices/usd-ils-fix-historical-data) - איכות: בינונית - 3.0660 ב-2026-09-28
- [בנק ישראל](https://www.boi.org.il/roles/markets/exchangerates/usdollar/) - **נכשל**: בדיקת אבטחה (Radware)
**מסקנה:** 3.066, רק להמרת נתונים מארה"ב. נושא דינמי.
**קובץ:** `usd-ils-rate-2026-09-28.md`
---

## 2026-09-29 | שובר גוגל אדס: איך הצעות קידום עובדות | ערוצים
**מילות מפתח:** שובר, promotional credit, promo code, קרדיט, 1500
**שאילתות:** "Google Ads promotional credit Israel spend 1500 ILS terms new advertiser"
**מקורות:**
- [Google Ads Help, 2393021](https://support.google.com/google-ads/answer/2393021?hl=en) - איכות: גבוהה - "הוצא X קבל Y", 60 יום להוצאה, עד 35 יום אימות, 60 יום לניצול
- [Google Ads Help, 6388096](https://support.google.com/google-ads/answer/6388096?hl=en) - איכות: גבוהה - חשבון צעיר מ-14 יום במימוש, הזיכוי לא נספר בהוצאה הנדרשת
- apexonmedia.com (משווק שוברים) - איכות: נמוכה - **לא נקרא, לא נכנס**
**מסקנה:** השובר, אם הוא בנוי כך, נפתח רק אחרי הוצאה עצמית ומגיע באיחור של עד 35 יום. התנאים של השובר הספציפי: לבדיקת נימרוד.
**קובץ:** `google-ads-promotional-offers.md`
---

## 2026-09-29 | עלות קליק וליד: גוגל ומטא | ערוצים
**מילות מפתח:** CPC, CPL, עלות לקליק, עלות לליד, benchmarks, home services, home improvement, שיפוצים
**שאילתות:** "Google Ads benchmarks 2025 home services cost per lead conversion rate by industry", "Facebook ads benchmarks 2025 cost per lead home improvement", "עלות לקליק גוגל אדס ישראל 2025 ממוצע ענף", "עלות ליד פייסבוק ישראל שיפוצים 2025", "מדד פרסום מטא ישראל 2026 עלות ליד לפי ענף"
**מקורות:**
- [LocaliQ, Home Services Search](https://localiq.com/blog/home-services-search-advertising-benchmarks/) - איכות: גבוהה, ארה"ב - 3,211 קמפיינים, קבלנים 2.61% המרה, גינון 6.42%
- [LocaliQ, Facebook 2026](https://localiq.com/blog/facebook-advertising-benchmarks/) - איכות: בינונית-גבוהה, ארה"ב - Home Improvement בקמפיין לידים $42.95 לליד
- [BOOSTIT, מדד ישראל 2026](https://www.boostit.co.il/general/google-ads-israel-benchmark-index/) - איכות: בינונית (נתוני סוכנות על החשבונות שלה, עם שיטה) - שירותי בית 16.8 ₪ לקליק, 75 ₪ לליד
- [WordStream Google 2025](https://www.wordstream.com/blog/2025-google-ads-benchmarks) ו-[WordStream Facebook 2025](https://www.wordstream.com/blog/facebook-ads-benchmarks-2025) - **נכשל**: 403
- [theadspend.com](https://theadspend.com/blog/facebook-leads-home-improvement) - **נכשל**: 429
- מדריכי סוכנויות ישראליות למחיר פרסום בפייסבוק (bluegiraffe, cxm, bidernet ועוד) - איכות: נמוכה - בלי מקור לנתונים. **לא נקראו, לא נכנסו**
**מסקנה:** יש נתון ישראלי אחד לגוגל (בינוני). **אין נתון ישראלי למטא שעומד בקריטריונים.** מטא מוערך מנתון אמריקאי, ומסומן.
**קובץ:** `localiq-home-services-search-2025.md`, `localiq-facebook-benchmarks-2026.md`, `boostit-google-ads-israel-index-2026.md`
---

## 2026-09-29 | מתחרים: פרגולות עץ במרכז | מתחרים
**מילות מפתח:** פרגולות עץ, פרגולה מעץ, מתחרים, מחיר למטר, ספריית מודעות
**שאילתות:** "פרגולות עץ מרכז הארץ", "פרגולה מחיר למטר 2026"
**מקורות:**
- [עץ ופלא](https://etzvapele.co.il/pergola/) - איכות: גבוהה (אתר המתחרה)
- [אביב פרגולות](https://aviv-pergola.co.il/wooden-pergolas/) - איכות: גבוהה
- [MyWood](https://my-wood.co.il/%D7%A4%D7%A8%D7%92%D7%95%D7%9C%D7%95%D7%AA-%D7%A2%D7%A5/) - איכות: גבוהה
- [עצי חזון](https://www.hazongroup.co.il/%D7%A4%D7%A8%D7%92%D7%95%D7%9C%D7%95%D7%AA/) - איכות: גבוהה
- [עץ ועצה](https://www.eza.co.il/pergola-design/) - איכות: גבוהה
- [פרגולות ישראל](https://www.pergolass.co.il/pergola-price/) - איכות: גבוהה
- [ספריית המודעות של מטא](https://www.facebook.com/ads/library/) - **נכשל**: socket hang up. לא נבדק
**מסקנה:** מחיר למ"ר וביקורות גוגל הם הנורמה. קונסטרוקטור בצוות לא מופיע כמסר אצל אף מתחרה.
**קובץ:** `competitors.md`
---

## 2026-09-29 | ביקוש ועונתיות לפרגולות | ביקוש
**מילות מפתח:** עונתיות, seasonality, מתי לבנות פרגולה, Google Trends, חורף, היתר, פטור
**שאילתות:** "פרגולה מתי הזמן הכי טוב לבנות חורף", "Google Trends pergola seasonality search interest by month", "pergola demand seasonality homeowners when to buy fall winter off-season contractors", "פרגולה צריך היתר 2026 פטור 50 מטר"
**מקורות:**
- [Google Trends, IL, "פרגולה"](https://trends.google.com/trends/explore?date=today%205-y&geo=IL&q=%D7%A4%D7%A8%D7%92%D7%95%D7%9C%D7%94) - **נכשל**: 429. לנסות שוב רק ידנית, בדפדפן
- [Wright Timber Frame](https://wrighttimberframe.com/best-time-to-buy-a-pergola/) - איכות: נמוכה, ארה"ב, ספק - שיא באביב-קיץ, שקט בנובמבר-פברואר
- [פרגולן](https://www.pergolan.co.il/pergolot/pergola-for-the-winter/) - איכות: נמוכה - על סגירות חורף, אין נתון עונתיות
- תוצאות "חוק הפרגולות" - לא נקראו. **ניסוחי החיפוש שחוזרים:** "פרגולות עץ", "פרגולה מעץ", "פרגולה מחיר למטר", "כמה עולה פרגולה", "חוק הפרגולות", "היתר לפרגולה"
**מסקנה:** **לא נמצא נתון עונתיות ישראלי.** לפי ספק אמריקאי, אחרי סוכות היא תחילת העונה השקטה. החיפוש סביב פרגולה נע סביב מחיר והיתר.
**קובץ:** `pergola-seasonality-us-vendor.md`
---
