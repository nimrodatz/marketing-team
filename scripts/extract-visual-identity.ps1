<#
.SYNOPSIS
    משיכת ה-HTML וגיליונות הסגנון של Craft & System, לצורך חילוץ הזהות הוויזואלית.

.DESCRIPTION
    למה זה קיים:
      vault/Brand Guidelines/ הגדיר קול (voice-and-tone.md) וקהל (icp-construction.md),
      אבל לא הגדיר איך המותג נראה. בלי קובץ זהות ויזואלית, סוכן דפי הנחיתה ממציא
      צבעים וטיפוגרפיה — ועושה את זה מחדש בכל ריצה.

    מי מריץ:
      המנכ"ל (הסשן הראשי) בלבד, כשצריך לרענן את vault/Brand Guidelines/visual-identity.md.
      הסוכנים לא ניגשים לרשת. הם קוראים את הקובץ הסטטי.

    מה זה עושה:
      מושך את דף הבית, מאתר בו כל <link rel="stylesheet"> וכל <style> מוטמע,
      מושך את קובצי ה-CSS החיצוניים, ושומר הכל לתיקיית פלט אחת לקריאה.

    מה זה לא עושה:
      לא כותב לוולט ולא מייצר את הקובץ. חילוץ פלטה וסולם טיפוגרפי הוא עבודת קריאה
      ועריכה, בדיוק כמו site-copy.md — הסקריפט מביא את החומר הגולמי, המנכ"ל כותב.

    קודי יציאה:
      0 = נמשך בהצלחה · 2 = המשיכה נכשלה (רשת/סטטוס)

.EXAMPLE
    pwsh -File scripts/extract-visual-identity.ps1 -OutDir "$env:TEMP/cs-visual"
#>

param(
    [string]$OutDir = './.visual-extract'
)

$ErrorActionPreference = 'Stop'
$OutputEncoding = [System.Text.Encoding]::UTF8

$SiteUrl = 'https://craftsystem.co.il/'
$Agent   = @{ 'User-Agent' = 'craft-system-visual-extract/1.0' }

function Get-Text {
    param([string]$Uri)
    $r = Invoke-WebRequest -Uri $Uri -UseBasicParsing -TimeoutSec 30 -Headers $Agent
    if ($r.StatusCode -ne 200) { throw "status $($r.StatusCode)" }
    return [System.Text.Encoding]::UTF8.GetString($r.RawContentStream.ToArray())
}

try   { $html = Get-Text -Uri $SiteUrl }
catch {
    Write-Host "X כשל בפנייה ל-$SiteUrl : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host '  אין להסיק שהעיצוב השתנה — רק שהמשיכה נכשלה. אין להמציא פלטה.'
    exit 2
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
[System.IO.File]::WriteAllText((Join-Path $OutDir 'index.html'), $html, [System.Text.Encoding]::UTF8)
Write-Host "V דף הבית נשמר ($($html.Length) תווים)" -ForegroundColor Green

# <style> מוטמע — באתרים סטטיים קטנים זה לרוב עיקר העיצוב
$inline = [regex]::Matches($html, '(?is)<style\b[^>]*>(.*?)</style>')
if ($inline.Count -gt 0) {
    $joined = ($inline | ForEach-Object { $_.Groups[1].Value }) -join "`n/* ---- */`n"
    [System.IO.File]::WriteAllText((Join-Path $OutDir 'inline.css'), $joined, [System.Text.Encoding]::UTF8)
    Write-Host "V $($inline.Count) בלוקי <style> מוטמעים נשמרו ($($joined.Length) תווים)" -ForegroundColor Green
}

# גיליונות חיצוניים
$hrefs = [regex]::Matches($html, '(?is)<link\b[^>]*rel\s*=\s*["'']?stylesheet["'']?[^>]*>') |
         ForEach-Object { [regex]::Match($_.Value, '(?is)href\s*=\s*["'']([^"'']+)["'']').Groups[1].Value } |
         Where-Object { $_ } | Select-Object -Unique

$i = 0
foreach ($href in $hrefs) {
    $abs = if ($href -match '^https?://') { $href } else { ([uri]::new([uri]$SiteUrl, $href)).AbsoluteUri }
    $i++
    try {
        $css = Get-Text -Uri $abs
        $name = 'sheet{0:d2}.css' -f $i
        [System.IO.File]::WriteAllText((Join-Path $OutDir $name), "/* $abs */`n$css", [System.Text.Encoding]::UTF8)
        Write-Host "V $name  <-  $abs  ($($css.Length) תווים)" -ForegroundColor Green
    }
    catch {
        Write-Host "X לא נמשך: $abs  ($($_.Exception.Message))" -ForegroundColor Yellow
    }
}

Write-Host ''
Write-Host "החומר הגולמי ב-$OutDir. הצעד הבא הוא קריאה וכתיבה ידנית של visual-identity.md."
exit 0
