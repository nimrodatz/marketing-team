# לוג החיפושים — <שם העסק>

זיכרון החיפושים של הלקוח. הוא קיים כדי שלא נחפש את אותו דבר פעמיים.

- **לפני** כל חיפוש, סוכן המחקר מריץ `Grep` על הקובץ עם מילות המפתח. אם יש התאמה מ-30 הימים האחרונים, הוא עוצר ושואל אם לעבוד על הקיים או לחפש מחדש. נושאים דינמיים (חדשות, מחירים) הם החריג: אותם מחפשים מחדש.
- **אחרי** כל חיפוש הוא מוסיף entry **בראש הרשימה**, מתחת לקו. גם חיפוש שנכשל נרשם.

```markdown
## YYYY-MM-DD HH:MM | <נושא> | <מצב: sources / business / serp>
**מילות מפתח:** keyword1, מילה1
**שאילתות:** "query 1", "query 2"
**מקורות:**
- [כותרת](URL) - איכות: ⭐⭐⭐⭐ - <הערה>
**נבחר / מסקנה:** <...>
**קובץ:** <נתיב יחסי לתיקיית הלקוח, או —>
---
```

---

## 2026-09-29 | SERP: מדריך מקלטים + מדריך סלובקי לישראל + חיים בישראל | serp
**מילות מפתח:** kam sa schovať pri raketovom útoku, úkryt pri leteckom útoku, čo robiť pri sirénach, slovenský sprievodca Izrael, sprievodca Tel Aviv, život v Izraeli, Slovenka v Izraeli
**שאילתות:** "kam sa schovať pri raketovom útoku", "civilná ochrana úkryt byt čo robiť pri sirénach minv.sk", "civilná ochrana ukrytie obyvateľstva raketový útok...", "slovenský sprievodca Izrael", "sprievodca Tel Aviv Jeruzalem prehliadka po slovensky", "Daniel sprievodca Izrael...", "život v Izraeli Slovenka", "čo robiť pri sirénach v Izraeli turista...", "sprievodca Tel Aviv slovensky tipy Tel Aviv blog"
**מקורות:**
- [bubo.sk raketový útok (Lviv)](https://bubo.sk/blog/ako-sa-spravat-pri-raketovom-utoku), [topky.sk](https://www.topky.sk/cl/11/9495669/Expert-prehovoril--Co-robit-pocas-leteckeho-utoku--Vyvracia-TENTO-bezny-omyl-ludi), [24dnes.sk](https://www.24dnes.sk/aktualne/zmrtvychvstanie-civilnej-ochrany-si-vynutila-nespolahlivost-protiraketovej-a-protidronovej-obrany-nie-kazdy-zije-vo-velkomeste-kde-maju-metro/), [bubo.sk/izrael](https://bubo.sk/izrael), [Daniel Sprievodca](https://sprievodcaizrael.wordpress.com/), [Bez Mapy bezpečnosť](https://bezmapy.com/bezpecnost-v-izraeli/), [obletsvet.sk](https://www.obletsvet.sk/destinacia/izrael/tel-aviv), [mamaaja.sk](https://mamaaja.sk/clanky/mama/vychova-bez-faciek-ale-v-tieni-siren-slovenska-mama-odkryva-zivot-v-izraeli/) - איכות: ⭐⭐⭐ - נקראו
- dennikn.sk, interez.sk, mzv.sk - 403; PDF של minv.sk לא קריא; minv.sk/?Ukrytie= החזיר דף בית ללא תוכן
**נבחר / מסקנה:** דירוגים אינדיקטיביים (WebSearch US-only). מקלטים: ~תחרות בינונית, הפער = מדריך מעשי לדירה רגילה, התוכן הרשמי הסלובקי הוא PDF מיושן בנוסח אזעקה כללית. sprievodca: ~בינונית-גבוהה כללי, נמוכה-בינונית בנישת מדריך יחיד (דניאל: אתר לא מעודכן מ-2017). "Slovenka v Izraeli": ה-SERP הוא ראיונות עם דיאנה עצמה; האתר לא הופיע. האתר שלה הופיע רק בחיפוש tel aviv tipy.
**קובץ:** research/serp-shelter-guide.md
---

## 2026-09-29 | SERP: תשלומים בישראל + Tel Aviv tipy | serp
**מילות מפתח:** platenie v Izraeli hotovosť alebo karta, mena v Izraeli, aká karta do Izraela, Tel Aviv tipy, čo vidieť v Tel Avive, Tel Aviv tipy co vidět
**שאילתות:** "platenie v Izraeli hotovosť alebo karta", "Tel Aviv tipy", "čo vidieť v Tel Avive tipy", "Izrael tipy na cestu dovolenka rady", "aká karta do Izraela výber z bankomatu šekel", "Tel Aviv tipy co vidět", "bezmapy.com Tel Aviv Izrael tipy", "telavivianfrombratislava.com platenie Izrael tipy Tel Aviv"
**מקורות:**
- [bubo.sk/izrael/peniaze](https://bubo.sk/izrael/peniaze), [cestolino.cz](https://www.cestolino.cz/pruvodce/izrael/mena-a-ceny/), [cestujlevne.com/penize](https://www.cestujlevne.com/pruvodce/izrael/penize), [faktyarady.sk](https://faktyarady.sk/co-vidiet-a-zazit-v-tel-avive/), [obletsvet.sk](https://www.obletsvet.sk/co-vidiet/izrael/tel-aviv), [obletsvet.cz](https://www.obletsvet.cz/pruvodce/izrael/tel-aviv), [dovolenka.sme.sk](https://dovolenka.sme.sk/i/izrael/tel-aviv), [bezmapy.com/azia/izrael](https://bezmapy.com/azia/izrael/), [האתר של דיאנה, 5 miest](https://www.telavivianfrombratislava.com/post/5-najzauj%C3%ADmavej%C5%A1%C3%ADch-miest-v-tel-avive-pre-slov%C3%A1kov) - איכות: ⭐⭐⭐ - נקראו
- dobrodruh.sk, emefka.sk - 403, לא נקראו
**נבחר / מסקנה:** כלי החיפוש US-only, אז הדירוג אינדיקטיבי ולא של גוגל.sk. תשלומים: תחרות נמוכה-בינונית, מדריכים ישנים, פער ברור. Tel Aviv tipy: תחרות גבוהה לכללי, פתח בזנב ארוך. Bez Mapy לא הופיע בשאילתות כלליות (5 מאמרים על ישראל, אחרון 2019). האתר של דיאנה הופיע רק כששם הדומיין נכלל בשאילתה.
**קובץ:** research/serp-payments-telaviv.md
---

## 2026-09-29 | SERP: בטיחות בנסיעה לישראל + ויזה/ETA-IL | serp
**מילות מפתח:** je bezpečné cestovať do Izraela, je bezpečné cestovat do Izraele, bezpečnosť Izrael cestovanie, víza do Izraela, ETA-IL, vstup do Izraela Slováci
**שאילתות:** "je bezpečné cestovať do Izraela", "víza do Izraela Slováci", "bezpečnosť Izrael cestovanie aktuálna situácia turisti", "je bezpečné cestovat do Izraele", "ETA-IL cestovné povolenie Izrael vstup do Izraela", "vstup do Izraela Slováci ETA-IL 2026", "víza do Izraele Češi ETA-IL", site:telavivianfrombratislava.com
**מקורות:**
- [mzv.gov.cz המלצת נסיעה](https://mzv.gov.cz/jnp/cz/cestujeme/aktualni_doporuceni_a_varovani/izrael_aktualni_doporuceni_k_cestam_2.html) - איכות: ⭐⭐⭐⭐ - נקרא, 24.06.2026
- [dovolenka.sme.sk](https://dovolenka.sme.sk/cestovne-doklady/izrael), [BUBO](https://bubo.sk/izrael/cestovne-doklady-a-viza), [Bez Mapy x2](https://bezmapy.com/bezpecnost-v-izraeli/), [CK SEN](https://www.cksen.cz/pruvodce/izrael/bezpecnost/), [Deník](https://www.denik.cz/cestovani-po-svete/izraelem-s-mamou-a-bez-cestovky/), [Cestujlevne](https://www.cestujlevne.com/pruvodce/izrael/bezpecnost) - איכות: ⭐⭐⭐ - נקראו לצורך ניתוח SERP
- mzv.sk (3 כתובות), gov.il, israel-entry.piba.gov.il, embassies.gov.il - נחסמו (403 / ECONNRESET / תוכן ריק)
**נבחר / מסקנה:** האתר של דיאנה לא מדורג בשתי המילים. הפער: תוכן עדכני מהשטח. דרישת הכניסה הרשמית הסלובקית לא נקראה ישירות, צריך אימות ידני.
**קובץ:** research/serp-safety-visa.md
---

## 2026-09-29 | דוגמאות קול לאפיון | sources (voice samples)
**מילות מפתח:** voice samples, blog, Instagram captions, interview
**שאילתות:** — (WebFetch בלבד, לפי הוראה)
**מקורות:**
- [בלוג: Ako nepodľahnúť propagande Hamasu](https://www.telavivianfrombratislava.com/post/ako-nepod%C4%BEahn%C3%BA%C5%A5-propagande-hamasu-psychologick%C3%A1-anal%C3%BDza-a-objekt%C3%ADvne-vn%C3%ADmanie-reality) - איכות: ⭐⭐⭐⭐ - טקסט מלא (בניסיון שני)
- [IG DVNfR3sDdfJ](https://www.instagram.com/p/DVNfR3sDdfJ/), [IG DD_tLYkuPpA](https://www.instagram.com/p/DD_tLYkuPpA/), [IG DP-lqcZCLid](https://www.instagram.com/p/DP-lqcZCLid/) - איכות: ⭐⭐⭐ - כיתובים בלבד, הראשון והשני מלאים, השלישי קצר ואולי חלקי
- [ראיון brainee.hnonline.sk](https://brainee.hnonline.sk/notsorry/news/cestovanie/rozhovory/96291461-diana-zije-v-izraeli-nasa-spalna-je-protiraketovy-kryt-plaze-su-totalne-plne-je-mytus-ze-sa-tu-denne-striela) - נחסם: WebFetch לא מורשה לדומיין (2 ניסיונות)
**נבחר / מסקנה:** בלוג ואינסטגרם נשמרו. ראיון: לא נקרא, אין ציטוטים.
**קובץ:** voice-samples/blog.md, voice-samples/instagram.md, voice-samples/interview-quotes.md (רק סטטוס חסימה)
---

## 2026-09-29 | מחקר עסק ומתחרים | business
**מילות מפתח:** Telavivian from Bratislava, Izrael blog, život v Izraeli, Slovenka v Izraeli, Češka v Izraeli
**שאילתות:** "Slovenka žijúca v Izraeli blog instagram Izrael život", "Češka žijící v Izraeli blog Instagram život v Izraeli", "Izrael blog instagram sprievodca Slovák...", "židovská kultura Izrael instagram česky tvůrce...", "slovenskí tvorcovia príjmy Patreon..."
**מקורות:**
- [האתר](https://telavivianfrombratislava.com) - איכות: ⭐⭐⭐⭐ - תקציר בלבד
- [Instagram](https://www.instagram.com/telavivian_from_bratislava/) - איכות: ⭐⭐⭐ - 25.7K, חסר תדירות
- [Telegram](https://t.me/telavivian_from_bratislava) - איכות: ⭐⭐⭐ - 583 מנויים
- [Bez Mapy](https://bezmapy.com/azia/izrael/) - איכות: ⭐⭐⭐⭐
- [Daniel Sprievodca](https://sprievodcaizrael.wordpress.com/) - איכות: ⭐⭐⭐
**נבחר / מסקנה:** פייסבוק חסום. לא נמצא מתחרה ישיר מדויק. סעיף מודלי הכנסה מבוסס מעט מקורות. מספר דפים החזירו 404 או 403.
**קובץ:** research/business-site.md, research/competitors.md
---
