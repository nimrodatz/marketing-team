<#
.SYNOPSIS
    אימות העובדות הנעולות של לקוח מול האתר החי שלו.

.DESCRIPTION
    למה זה קיים:
      קובץ העובדות של לקוח (אצל C&S: references/writing/site-copy.md) הוא צילום מסך של האתר
      מרגע מסוים. אם מחיר משתנה באתר ואף אחד לא מעדכן את הקובץ, הסוכנים ימשיכו לכתוב את
      המחיר הישן.

    מי מריץ:
      המנכ"ל (הסשן הראשי) בתחילת כל ריצת פייפליין, לפני שלב הקופי.
      הסוכנים לא ניגשים לרשת ולא מריצים את זה. הם קוראים את קובץ העובדות בלבד.

    מה זה עושה:
      קורא את clients/<Client>/facts-check.json, מושך את ה-HTML של האתר ובודק שכל עובדה
      נעולה עדיין מופיעה בו. פלט OK, או דוח דריפט + יציאה בקוד 1.
      ללקוח בלי facts-check.json או בלי siteUrl: הודעת דילוג ויציאה בקוד 0.

    מה זה לא עושה:
      לא כותב לשום קובץ. המבנה העריכתי של קובץ העובדות הוא עבודת עריכה ולא פרסינג,
      ולכן העדכון בפועל הוא של המנכ"ל, אחרי הצגת הדריפט למשתמש ואישורו.

    קודי יציאה:
      0 = כל העובדות תואמות, או דילוג מוצהר · 1 = נמצא דריפט · 2 = הבדיקה עצמה נכשלה

.EXAMPLE
    pwsh -File scripts/verify-site-facts.ps1
    pwsh -File scripts/verify-site-facts.ps1 -Client craft-system
#>

param(
    [string]$Client = 'craft-system'
)

$ErrorActionPreference = 'Stop'
$OutputEncoding = [System.Text.Encoding]::UTF8

$RepoRoot   = Split-Path -Parent $PSScriptRoot
$ConfigPath = Join-Path $RepoRoot "clients/$Client/facts-check.json"

if (-not (Test-Path -LiteralPath $ConfigPath)) {
    Write-Host "דילוג: ללקוח '$Client' אין clients/$Client/facts-check.json." -ForegroundColor Yellow
    Write-Host '  אין מה לאמת מול אתר. זה לא אישור שהעובדות נכונות, רק שלא נבדקו.'
    exit 0
}

$config = Get-Content -LiteralPath $ConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json

if ([string]::IsNullOrWhiteSpace($config.siteUrl)) {
    Write-Host "דילוג: ללקוח '$Client' אין siteUrl ב-facts-check.json." -ForegroundColor Yellow
    Write-Host '  אין מה לאמת מול אתר. זה לא אישור שהעובדות נכונות, רק שלא נבדקו.'
    exit 0
}

$SiteUrl       = $config.siteUrl
$SourceOfTruth = $config.sourceOfTruth

# כל עובדה: group ו-label לתצוגה, needles = חלופות מקובלות (מספיק שאחת נמצאת).
$Facts = @($config.facts)

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
                                  -Headers @{ 'User-Agent' = "$Client-fact-check/1.0" }
}
catch {
    Write-Host "✗ כשל בפנייה ל-$SiteUrl : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host '  לא ניתן לאמת. אין להסיק שהעובדות השתנו, רק שהבדיקה נכשלה.'
    exit 2
}

if ($response.StatusCode -ne 200) {
    Write-Host "✗ האתר החזיר סטטוס $($response.StatusCode)" -ForegroundColor Red
    Write-Host '  לא ניתן לאמת. אין להסיק שהעובדות השתנו, רק שהבדיקה נכשלה.'
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
    foreach ($needle in $fact.needles) {
        if ($haystack.Contains($needle)) { $found = $true; break }
    }

    if ($found) {
        Write-Host "✓ [$($fact.group)] $($fact.label)" -ForegroundColor Green
    }
    else {
        Write-Host "✗ [$($fact.group)] $($fact.label)" -ForegroundColor Red
        $drift += $fact
    }
}

Write-Host ''

if ($drift.Count -eq 0) {
    Write-Host "OK: כל $($Facts.Count) העובדות הנעולות של '$Client' תואמות ל-$SourceOfTruth." -ForegroundColor Green
    exit 0
}

Write-Host "דריפט: $($drift.Count) עובדות של '$Client' לא נמצאו באתר:" -ForegroundColor Red
foreach ($fact in $drift) {
    Write-Host "  • [$($fact.group)] $($fact.label)  (חיפשנו: $($fact.needles -join ' | '))"
}
Write-Host ''
Write-Host 'עצירה. אין להריץ את הפייפליין על עובדות שלא אומתו.'
Write-Host "הצעד הבא: להציג את הדריפט למשתמש, ורק אחרי אישורו לעדכן את $SourceOfTruth."
Write-Host 'שינוי מחיר הוא החלטה של המשתמש בלבד, לא של המנוע.'
exit 1
