<#
.SYNOPSIS
    אימות העובדות הנעולות של Craft & System מול האתר החי.

.DESCRIPTION
    למה זה קיים:
      references/writing/site-copy.md הוא צילום מסך של האתר מרגע מסוים. אם מחיר משתנה
      באתר ואף אחד לא מעדכן את הקובץ, הסוכנים ימשיכו לכתוב את המחיר הישן.

    מי מריץ:
      המנכ"ל (הסשן הראשי) בתחילת כל ריצת פייפליין, לפני שלב הקופי.
      הסוכנים לא ניגשים לרשת ולא מריצים את זה. הם קוראים את site-copy.md בלבד.

    מה זה עושה:
      מושך את ה-HTML של האתר ובודק שכל עובדה נעולה עדיין מופיעה בו.
      פלט OK, או דוח דריפט + יציאה בקוד 1.

    מה זה לא עושה:
      לא כותב לשום קובץ. המבנה העריכתי של site-copy.md הוא עבודת עריכה ולא פרסינג,
      ולכן העדכון בפועל הוא של המנכ"ל — אחרי הצגת הדריפט למשתמש ואישורו.

    קודי יציאה:
      0 = כל העובדות תואמות · 1 = נמצא דריפט · 2 = הבדיקה עצמה נכשלה (רשת/סטטוס)

.EXAMPLE
    pwsh -File scripts/verify-site-facts.ps1
#>

$ErrorActionPreference = 'Stop'
$OutputEncoding = [System.Text.Encoding]::UTF8

$SiteUrl       = 'https://craftsystem.co.il/'
$SourceOfTruth = 'references/writing/site-copy.md'

# כל עובדה: Group ו-Label לתצוגה, Needles = חלופות מקובלות (מספיק שאחת נמצאת).
$Facts = @(
    @{ Group = 'מחירים';        Label = 'מסלול 01 — 990 ₪';              Needles = @('990') }
    @{ Group = 'מחירים';        Label = 'מסלול 02 — 3,200 ₪';            Needles = @('3,200', '3200') }
    @{ Group = 'מחירים';        Label = 'מסלול 03 — מחיר מותאם אישית';   Needles = @('מותאם אישית') }

    @{ Group = 'שמות מסלולים';  Label = 'חלון ראווה';                     Needles = @('חלון ראווה') }
    @{ Group = 'שמות מסלולים';  Label = 'שולחן עבודה';                    Needles = @('שולחן עבודה') }
    @{ Group = 'שמות מסלולים';  Label = 'אקו-סיסטם';                      Needles = @('אקו-סיסטם', 'אקו סיסטם') }

    @{ Group = 'וואטסאפ';       Label = 'מספר wa.me — 972506762006';      Needles = @('972506762006') }

    @{ Group = 'קייסים';        Label = 'קייס 1+2 — באים בטוב';           Needles = @('באים בטוב') }
    @{ Group = 'קייסים';        Label = 'קייס 1 — לינק חי baimbetov.me';  Needles = @('baimbetov.me') }
    @{ Group = 'קייסים';        Label = 'קייס 3 — לינק חי lukasbielka.com'; Needles = @('lukasbielka.com') }
    @{ Group = 'קייסים';        Label = 'קייס 4 — מורה דרך';              Needles = @('מורה דרך') }
)

# נרמול ה-HTML לטקסט נראה: הסרת script/style, הסרת תגיות, פענוח ישויות נפוצות
# וכיווץ רווחים. מונע החמצה כשתגית מפצלת מילה באמצע.
function ConvertTo-VisibleText {
    param([string]$Html)

    $t = [regex]::Replace($Html, '(?is)<(script|style)\b[^>]*>.*?</\1>', ' ')
    $t = [regex]::Replace($t, '(?s)<[^>]+>', ' ')
    $t = $t -replace '&nbsp;', ' ' -replace '&amp;', '&' -replace '&quot;', '"' `
            -replace '&#39;|&apos;', "'" -replace '&lt;', '<' -replace '&gt;', '>'
    return ($t -replace '\s+', ' ')
}

try {
    $response = Invoke-WebRequest -Uri $SiteUrl -UseBasicParsing -TimeoutSec 30 `
                                  -Headers @{ 'User-Agent' = 'craft-system-fact-check/1.0' }
}
catch {
    Write-Host "✗ כשל בפנייה ל-$SiteUrl : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host '  לא ניתן לאמת. אין להסיק שהעובדות השתנו — רק שהבדיקה נכשלה.'
    exit 2
}

if ($response.StatusCode -ne 200) {
    Write-Host "✗ האתר החזיר סטטוס $($response.StatusCode)" -ForegroundColor Red
    Write-Host '  לא ניתן לאמת. אין להסיק שהעובדות השתנו — רק שהבדיקה נכשלה.'
    exit 2
}

# קריאה מפורשת כ-UTF-8: בלי זה העברית חוזרת משובשת ובדיקת המחרוזות נכשלת מזויפת.
$html = [System.Text.Encoding]::UTF8.GetString($response.RawContentStream.ToArray())

# מחפשים גם ב-HTML הגולמי וגם בטקסט המנורמל: לינקים חיים (wa.me, baimbetov.me)
# יושבים ב-href ולא בטקסט הנראה.
$haystack = $html + "`n" + (ConvertTo-VisibleText -Html $html)

$drift = @()
foreach ($fact in $Facts) {
    $found = $false
    foreach ($needle in $fact.Needles) {
        if ($haystack.Contains($needle)) { $found = $true; break }
    }

    if ($found) {
        Write-Host "✓ [$($fact.Group)] $($fact.Label)" -ForegroundColor Green
    }
    else {
        Write-Host "✗ [$($fact.Group)] $($fact.Label)" -ForegroundColor Red
        $drift += $fact
    }
}

Write-Host ''

if ($drift.Count -eq 0) {
    Write-Host "OK — כל $($Facts.Count) העובדות הנעולות תואמות ל-$SourceOfTruth." -ForegroundColor Green
    exit 0
}

Write-Host "דריפט — $($drift.Count) עובדות לא נמצאו באתר:" -ForegroundColor Red
foreach ($fact in $drift) {
    Write-Host "  • [$($fact.Group)] $($fact.Label)  (חיפשנו: $($fact.Needles -join ' | '))"
}
Write-Host ''
Write-Host 'עצירה. אין להריץ את הפייפליין על עובדות שלא אומתו.'
Write-Host "הצעד הבא: להציג את הדריפט למשתמש, ורק אחרי אישורו לעדכן את $SourceOfTruth."
Write-Host 'שינוי מחיר הוא החלטה של המשתמש בלבד — לא של המנוע.'
exit 1
