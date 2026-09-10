<#
.SYNOPSIS
    Craft & System - בניית דף סקירה אחד לריצת פייפליין.

.DESCRIPTION
    למה זה קיים:
      תוצרי ריצה אחת מפוזרים על ארבע תיקיות ב-output/ , כי החלוקה שם היא לפי סוג
      התוצר ולא לפי ריצה. כדי לאשר שלב צריך לפתוח קובץ md, ואז תמונה, ואז דף HTML,
      ואז לזכור מה חסר. הסקריפט הזה אוסף את כל מה שקיים לריצה אחת לדף אחד.

    מה זה לא:
      **זו לא ערכת השליחה של שלב 5.** ערכת השליחה יושבת ב-output/kits/ , נכתבת
      בידי המנכ"ל, ונועדה לפתיחה בשטח. דף הסקירה הוא כלי בקרה פנימי בלבד:
      הוא נבנה אוטומטית, הוא לא תוצר, והוא לא עובר לאף אדם אחר.

    מה זה לא עושה:
      לא נוגע ברשת, לא כותב לשום קובץ ב-output/ או ב-vault/ , ולא משנה אף תוצר.
      קורא בלבד, וכותב דף אחד ל-review/ .

    איפה נשמר הפלט:
      review/<date>-<topic>-run<N>-review.html
      התיקייה מוחרגת מגיט. הדף נגזר במלואו מהתוצרים, ולכן אין מה לשמור בהיסטוריה.

    קודי יציאה:
      0 = הדף נבנה · 1 = לא נמצאה ריצה תואמת · 2 = הבדיקה עצמה נכשלה

.EXAMPLE
    pwsh -File scripts/build-review.ps1
    pwsh -File scripts/build-review.ps1 -List
    pwsh -File scripts/build-review.ps1 -Topic peer-warm-group -Run 2 -Open
#>

[CmdletBinding()]
param(
    [string]$Topic,
    [int]$Run = 0,
    [switch]$List,
    [switch]$Open
)

$ErrorActionPreference = 'Stop'
$OutputEncoding = [System.Text.Encoding]::UTF8

$RepoRoot = Split-Path -Parent $PSScriptRoot

# ─── מרנדרר Markdown מינימלי ────────────────────────────────────────────────
# מספיק בדיוק לפורמט שהסוכנים כותבים: כותרות, טבלאות, קוד, callouts, רשימות.
# לא מנוע Markdown כללי, ואין כוונה שיהיה.

function Convert-Inline {
    param([string]$Text)

    $t = $Text -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;'
    $t = [regex]::Replace($t, '`([^`]+)`', '<code>$1</code>')
    $t = [regex]::Replace($t, '\*\*([^*]+)\*\*', '<strong>$1</strong>')
    $t = [regex]::Replace($t, '(?<![*\w])\*([^*\n]+)\*(?!\*)', '<em>$1</em>')
    $t = [regex]::Replace($t, '\[\[([^\]|]+)\|([^\]]+)\]\]', '<span class="wiki">$2</span>')
    $t = [regex]::Replace($t, '\[\[([^\]]+)\]\]', '<span class="wiki">$1</span>')
    $t = [regex]::Replace($t, '\[([^\]]+)\]\(([^)]+)\)', '<a href="$2">$1</a>')
    return $t
}

function Convert-Block {
    param([string]$Text)

    $esc = $Text -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;'
    return $esc
}

function Convert-Markdown {
    param([string]$Markdown)

    $lines = $Markdown -split "`r?`n"
    $out = [System.Text.StringBuilder]::new()
    $i = 0

    # frontmatter, רק בראש הקובץ
    if ($lines.Count -gt 0 -and $lines[0].Trim() -eq '---') {
        $j = 1
        while ($j -lt $lines.Count -and $lines[$j].Trim() -ne '---') { $j++ }
        if ($j -lt $lines.Count) { $i = $j + 1 }
    }

    while ($i -lt $lines.Count) {
        $line = $lines[$i]

        # גוש קוד
        if ($line -match '^\s*```') {
            $i++
            $buf = @()
            while ($i -lt $lines.Count -and $lines[$i] -notmatch '^\s*```') {
                $buf += $lines[$i]; $i++
            }
            $i++
            $body = Convert-Block ($buf -join "`n")
            [void]$out.AppendLine("<pre class=""snippet""><code>$body</code></pre>")
            continue
        }

        # קו מפריד
        if ($line -match '^\s*(-{3,}|\*{3,}|_{3,})\s*$') {
            [void]$out.AppendLine('<hr>')
            $i++
            continue
        }

        # כותרת
        if ($line -match '^(#{1,6})\s+(.*)$') {
            $lvl = $Matches[1].Length + 1
            if ($lvl -gt 6) { $lvl = 6 }
            $txt = Convert-Inline $Matches[2]
            [void]$out.AppendLine("<h$lvl>$txt</h$lvl>")
            $i++
            continue
        }

        # ציטוט או callout
        if ($line -match '^>\s?') {
            $buf = @()
            while ($i -lt $lines.Count -and $lines[$i] -match '^>\s?') {
                $buf += ($lines[$i] -replace '^>\s?', '')
                $i++
            }
            $kind = 'note'
            $title = ''
            if ($buf.Count -gt 0 -and $buf[0] -match '^\s*\[!(\w+)\]\s*(.*)$') {
                $kind = $Matches[1].ToLower()
                $title = $Matches[2]
                $buf = $buf[1..($buf.Count - 1)]
            }
            [void]$out.AppendLine("<div class=""callout callout-$kind"">")
            if ($title) { [void]$out.AppendLine("<div class=""callout-title"">$(Convert-Inline $title)</div>") }
            $inner = Convert-Markdown (($buf -join "`n"))
            [void]$out.AppendLine($inner)
            [void]$out.AppendLine('</div>')
            continue
        }

        # טבלה
        if ($line -match '^\s*\|') {
            $rows = @()
            while ($i -lt $lines.Count -and $lines[$i] -match '^\s*\|') {
                $rows += $lines[$i]; $i++
            }
            [void]$out.AppendLine('<div class="table-wrap"><table>')
            $rowIndex = 0
            $hasHead = $false
            if ($rows.Count -ge 2 -and $rows[1] -match '^[\s|:\-]+$') { $hasHead = $true }
            foreach ($r in $rows) {
                if ($hasHead -and $rowIndex -eq 1) { $rowIndex++; continue }
                $cells = $r.Trim().Trim('|') -split '(?<!\\)\|'
                $tag = if ($hasHead -and $rowIndex -eq 0) { 'th' } else { 'td' }
                if ($rowIndex -eq 0 -and $hasHead) { [void]$out.AppendLine('<thead>') }
                [void]$out.Append('<tr>')
                foreach ($c in $cells) {
                    [void]$out.Append("<$tag>$(Convert-Inline $c.Trim())</$tag>")
                }
                [void]$out.AppendLine('</tr>')
                if ($rowIndex -eq 0 -and $hasHead) { [void]$out.AppendLine('</thead><tbody>') }
                $rowIndex++
            }
            if ($hasHead) { [void]$out.AppendLine('</tbody>') }
            [void]$out.AppendLine('</table></div>')
            continue
        }

        # רשימה
        if ($line -match '^(\s*)([-*+]|\d+[.)])\s+(.*)$') {
            $ordered = $Matches[2] -match '^\d'
            $tag = if ($ordered) { 'ol' } else { 'ul' }
            [void]$out.AppendLine("<$tag>")
            while ($i -lt $lines.Count -and $lines[$i] -match '^(\s*)([-*+]|\d+[.)])\s+(.*)$') {
                $item = $Matches[3]
                $i++
                # שורות המשך של אותו פריט
                while ($i -lt $lines.Count -and
                       $lines[$i] -match '^\s+\S' -and
                       $lines[$i] -notmatch '^(\s*)([-*+]|\d+[.)])\s+') {
                    $item += ' ' + $lines[$i].Trim()
                    $i++
                }
                [void]$out.AppendLine("<li>$(Convert-Inline $item)</li>")
            }
            [void]$out.AppendLine("</$tag>")
            continue
        }

        # שורה ריקה
        if ($line -match '^\s*$') { $i++; continue }

        # פסקה
        $para = @()
        while ($i -lt $lines.Count -and
               $lines[$i] -notmatch '^\s*$' -and
               $lines[$i] -notmatch '^(#{1,6}\s|>|\s*\||\s*```)' -and
               $lines[$i] -notmatch '^\s*([-*+]|\d+[.)])\s+' -and
               $lines[$i] -notmatch '^\s*(-{3,}|\*{3,}|_{3,})\s*$') {
            $para += $lines[$i]
            $i++
        }
        if ($para.Count -gt 0) {
            [void]$out.AppendLine("<p>$(Convert-Inline ($para -join ' '))</p>")
        }
    }

    return $out.ToString()
}

# ─── גילוי ריצות ────────────────────────────────────────────────────────────

function Format-Size {
    param([long]$Bytes)
    if ($Bytes -ge 1MB) { return ('{0:N1} MB' -f ($Bytes / 1MB)) }
    if ($Bytes -ge 1KB) { return ('{0:N0} KB' -f ($Bytes / 1KB)) }
    return "$Bytes B"
}

$marketingDir = Join-Path $RepoRoot 'output/marketing'
if (-not (Test-Path -LiteralPath $marketingDir)) {
    Write-Error "לא נמצאה התיקייה output/marketing. הרץ מתוך שורש המאגר."
    exit 2
}

$runs = @()
Get-ChildItem -LiteralPath $marketingDir -Filter '*-copy.md' -File | ForEach-Object {
    if ($_.Name -match '^(\d{4}-\d{2}-\d{2})-(.+)-run(\d+)-copy\.md$') {
        $runs += [pscustomobject]@{
            Date  = $Matches[1]
            Topic = $Matches[2]
            Run   = [int]$Matches[3]
            Slug  = "$($Matches[1])-$($Matches[2])-run$($Matches[3])"
            Copy  = $_.FullName
        }
    }
}

if ($runs.Count -eq 0) {
    Write-Error "לא נמצא אף קובץ קופי ב-output/marketing."
    exit 1
}

$runs = $runs | Sort-Object Date, Topic, Run

if ($List) {
    Write-Host ""
    Write-Host "  ריצות שנמצאו ב-output/" -ForegroundColor Cyan
    Write-Host ""
    $runs | ForEach-Object {
        $kit  = Get-ChildItem -LiteralPath $marketingDir -Filter "$($_.Slug)-outbound-kit.md" -File -ErrorAction SilentlyContinue
        $pngs = @(Get-ChildItem -LiteralPath (Join-Path $RepoRoot 'output/creatives') -Filter "$($_.Slug)-*.png" -File -ErrorAction SilentlyContinue)
        $land = Test-Path -LiteralPath (Join-Path $RepoRoot "output/landing/$($_.Slug)")
        $send = Test-Path -LiteralPath (Join-Path $RepoRoot "output/kits/$($_.Slug)-kit.html")
        $mark = { param($ok) if ($ok) { '✔' } else { '·' } }
        Write-Host ("  {0}  run{1}  {2}   שלב1 {3}  שלב2 {4}  שלב3 {5}({6})  שלב4 {7}  שלב5 {8}" -f `
            $_.Date, $_.Run, $_.Topic.PadRight(28), (& $mark $true), (& $mark ([bool]$kit)),
            (& $mark ($pngs.Count -gt 0)), $pngs.Count, (& $mark $land), (& $mark $send))
    }
    Write-Host ""
    Write-Host "  לבנייה:  pwsh -File scripts/build-review.ps1 -Topic <topic> -Run <N> -Open" -ForegroundColor DarkGray
    Write-Host ""
    exit 0
}

$candidates = $runs
if ($Topic) { $candidates = $candidates | Where-Object { $_.Topic -eq $Topic } }
if ($Run -gt 0) { $candidates = $candidates | Where-Object { $_.Run -eq $Run } }

if (-not $candidates -or @($candidates).Count -eq 0) {
    Write-Error "לא נמצאה ריצה תואמת. הרץ עם -List כדי לראות מה קיים."
    exit 1
}

$target = @($candidates)[-1]

# ─── איסוף התוצרים ──────────────────────────────────────────────────────────

$slug = $target.Slug

$copyPath    = $target.Copy
$kitPath     = Join-Path $marketingDir "$slug-outbound-kit.md"
$creativeDir = Join-Path $RepoRoot 'output/creatives'
$landingDir  = Join-Path $RepoRoot "output/landing/$slug"
$sendKitPath = Join-Path $RepoRoot "output/kits/$slug-kit.html"
$notePath    = Join-Path $RepoRoot "vault/Publishing Log/$($target.Topic)-run-$($target.Run).md"

$pngs = @()
if (Test-Path -LiteralPath $creativeDir) {
    $pngs = @(Get-ChildItem -LiteralPath $creativeDir -Filter "$slug-*.png" -File | Sort-Object Name)
}

$landingAssets = @()
$landingConfig = $null
if (Test-Path -LiteralPath $landingDir) {
    $assetsDir = Join-Path $landingDir 'assets'
    if (Test-Path -LiteralPath $assetsDir) {
        $landingAssets = @(Get-ChildItem -LiteralPath $assetsDir -File | Sort-Object Name)
    }
    $cfg = Join-Path $landingDir 'config.json'
    if (Test-Path -LiteralPath $cfg) { $landingConfig = Get-Content -LiteralPath $cfg -Raw -Encoding UTF8 }
}

# ─── בניית הדף ──────────────────────────────────────────────────────────────

$html = [System.Text.StringBuilder]::new()

function Add-Stage {
    param(
        [string]$Id,
        [string]$Num,
        [string]$Title,
        [bool]$Exists,
        [string]$PathLabel,
        [string]$Body,
        [bool]$Collapsed = $false
    )
    $badge = if ($Exists) { '<span class="badge badge-ok">קיים</span>' } else { '<span class="badge badge-missing">לא רץ</span>' }
    $openAttr = if ($Exists -and -not $Collapsed) { ' open' } else { '' }
    [void]$html.AppendLine("<section class=""stage"" id=""$Id"">")
    [void]$html.AppendLine("<details$openAttr>")
    [void]$html.AppendLine("<summary><span class=""stage-num"">$Num</span><span class=""stage-title"">$Title</span>$badge</summary>")
    if ($PathLabel) { [void]$html.AppendLine("<div class=""path"">$PathLabel</div>") }
    [void]$html.AppendLine("<div class=""stage-body"">$Body</div>")
    [void]$html.AppendLine('</details>')
    [void]$html.AppendLine('</section>')
}

# שלב 1
$copyBody = Convert-Markdown (Get-Content -LiteralPath $copyPath -Raw -Encoding UTF8)

# שלב 2
$kitExists = Test-Path -LiteralPath $kitPath
$kitBody = if ($kitExists) {
    Convert-Markdown (Get-Content -LiteralPath $kitPath -Raw -Encoding UTF8)
} else {
    '<p class="empty">אין ערכת שטח לריצה הזאת. שלב 2 לא רץ, או שהוא רץ ולא נשמר בשם התקני.</p>'
}

# שלב 3
$creativeBody = if ($pngs.Count -gt 0) {
    $g = [System.Text.StringBuilder]::new()
    [void]$g.AppendLine('<div class="gallery">')
    foreach ($p in $pngs) {
        $rel = "../output/creatives/$($p.Name)"
        $overlay = Join-Path $creativeDir ($p.BaseName + '.html')
        $overlayLink = if (Test-Path -LiteralPath $overlay) {
            "<a href=""../output/creatives/$($p.BaseName).html"" target=""_blank"">פתח את שכבת ההלבשה העברית</a>"
        } else {
            '<span class="muted">אין קובץ הלבשה תואם</span>'
        }
        [void]$g.AppendLine("<figure><a href=""$rel"" target=""_blank""><img src=""$rel"" alt=""$($p.Name)""></a>")
        [void]$g.AppendLine("<figcaption><code>$($p.Name)</code><br>$(Format-Size $p.Length) · $overlayLink</figcaption></figure>")
    }
    [void]$g.AppendLine('</div>')
    [void]$g.AppendLine('<p class="hint">התמונה הנקייה היא ללא מילים בכוונה. הכותרת העברית יושבת בקובץ ההלבשה שלצידה, ורק שם רואים את התוצר המלא.</p>')
    $g.ToString()
} else {
    '<p class="empty">אין קריאייטיב לריצה הזאת. שלב 3 לא רץ.</p>'
}

# שלב 4
$landingExists = Test-Path -LiteralPath $landingDir
$landingBody = if ($landingExists) {
    $l = [System.Text.StringBuilder]::new()
    [void]$l.AppendLine("<p><a class=""btn"" href=""../output/landing/$slug/index.html"" target=""_blank"">פתח את דף הנחיתה בדפדפן</a></p>")
    [void]$l.AppendLine('<p class="hint">לבדיקה בטלפון אמיתי, על אותה רשת ובלי להעלות לשום שרת:</p>')
    [void]$l.AppendLine("<pre class=""snippet""><code>pwsh -File scripts/serve-landing.ps1 -Root ""output/landing/$slug""</code></pre>")
    if ($landingAssets.Count -gt 0) {
        $total = ($landingAssets | Measure-Object -Property Length -Sum).Sum
        [void]$l.AppendLine('<h3>נכסים בתוך התיקייה</h3><div class="table-wrap"><table><thead><tr><th>קובץ</th><th>גודל</th></tr></thead><tbody>')
        foreach ($a in $landingAssets) {
            [void]$l.AppendLine("<tr><td><code>$($a.Name)</code></td><td>$(Format-Size $a.Length)</td></tr>")
        }
        [void]$l.AppendLine("<tr><td><strong>סך הכל</strong></td><td><strong>$(Format-Size $total)</strong></td></tr>")
        [void]$l.AppendLine('</tbody></table></div>')
    }
    if ($landingConfig) {
        [void]$l.AppendLine("<h3>config.json</h3><pre class=""snippet""><code>$(Convert-Block $landingConfig)</code></pre>")
    }
    $l.ToString()
} else {
    '<p class="empty">אין דף נחיתה לריצה הזאת. שלב 4 לא רץ.</p>'
}

# שלב 5
$sendExists = Test-Path -LiteralPath $sendKitPath
$sendBody = if ($sendExists) {
    "<p><a class=""btn"" href=""../output/kits/$slug-kit.html"" target=""_blank"">פתח את ערכת השליחה</a></p>" +
    '<p class="hint">זה התוצר שנפתח בטלפון בשטח. הוא לא מוסיף אף מילה חדשה, הכל מועתק מהקבצים המאושרים שלמעלה.</p>'
} else {
    '<p class="empty">ערכת השליחה לא נכתבה. שלב 5 לא רץ, והריצה אינה סגורה.</p>'
}

# רשומת הריצה
$noteExists = Test-Path -LiteralPath $notePath
$noteBody = if ($noteExists) {
    Convert-Markdown (Get-Content -LiteralPath $notePath -Raw -Encoding UTF8)
} else {
    '<p class="empty">אין רשומת ריצה ב-vault/Publishing Log.</p>'
}

# כותרת ומצב
$stages = @(
    @{ N = '1'; T = 'קופי';        Ok = $true }
    @{ N = '2'; T = 'ערכת שטח';    Ok = $kitExists }
    @{ N = '3'; T = 'קריאייטיב';   Ok = ($pngs.Count -gt 0) }
    @{ N = '4'; T = 'דף נחיתה';    Ok = $landingExists }
    @{ N = '5'; T = 'ערכת שליחה';  Ok = $sendExists }
)
$missing = @($stages | Where-Object { -not $_.Ok } | ForEach-Object { "שלב $($_.N)" })

[void]$html.AppendLine('<header class="page-head">')
[void]$html.AppendLine("<div class=""eyebrow"">דף סקירה · כלי בקרה פנימי, לא תוצר שנשלח</div>")
[void]$html.AppendLine("<h1>$($target.Topic) · ריצה $($target.Run)</h1>")
[void]$html.AppendLine("<div class=""meta"">תאריך התוצרים: $($target.Date) · נבנה: $(Get-Date -Format 'yyyy-MM-dd HH:mm')</div>")
[void]$html.AppendLine('<div class="chips">')
foreach ($s in $stages) {
    $cls = if ($s.Ok) { 'chip chip-ok' } else { 'chip chip-missing' }
    [void]$html.AppendLine("<a class=""$cls"" href=""#stage$($s.N)"">$($s.N) · $($s.T)</a>")
}
[void]$html.AppendLine('</div>')
if ($missing.Count -gt 0) {
    [void]$html.AppendLine("<div class=""alert"">לא רץ בריצה הזאת: $($missing -join ' , ')</div>")
} else {
    [void]$html.AppendLine('<div class="alert alert-ok">כל חמשת השלבים קיימים בתיקיות.</div>')
}
[void]$html.AppendLine('</header>')

Add-Stage -Id 'stage1' -Num '1' -Title 'קופי, זוויות והוקים' -Exists $true `
    -PathLabel "output/marketing/$slug-copy.md" -Body $copyBody
Add-Stage -Id 'stage2' -Num '2' -Title 'ערכת שטח, Outbound' -Exists $kitExists `
    -PathLabel "output/marketing/$slug-outbound-kit.md" -Body $kitBody -Collapsed $true
Add-Stage -Id 'stage3' -Num '3' -Title 'קריאייטיב, תמונות ושכבת הלבשה' -Exists ($pngs.Count -gt 0) `
    -PathLabel "output/creatives/$slug-*.png" -Body $creativeBody
Add-Stage -Id 'stage4' -Num '4' -Title 'דף נחיתה' -Exists $landingExists `
    -PathLabel "output/landing/$slug/" -Body $landingBody
Add-Stage -Id 'stage5' -Num '5' -Title 'ערכת שליחה' -Exists $sendExists `
    -PathLabel "output/kits/$slug-kit.html" -Body $sendBody
Add-Stage -Id 'note' -Num '★' -Title 'רשומת הריצה ביומן הפרסום' -Exists $noteExists `
    -PathLabel "vault/Publishing Log/$($target.Topic)-run-$($target.Run).md" -Body $noteBody -Collapsed $true

$css = @'
:root{
  --bg:#F8F6F2; --bg2:#EDEAE4; --card:#FFFFFF;
  --text:#1A1714; --text2:#6B6460; --muted:#A09890;
  --accent:#B5634B; --accent2:#9A523D;
  --border:#DDD8D0; --border2:#C0B8B0; --sand:#9C8E82;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);
  font-family:"Heebo","Assistant","Segoe UI",Arial,sans-serif;
  font-size:16px;line-height:1.75}
.wrap{max-width:900px;margin:0 auto;padding:1.5rem 1.25rem 6rem}
.page-head{background:var(--card);border:1px solid var(--border);border-radius:14px;
  padding:1.25rem 1.5rem;margin-bottom:1.5rem}
.eyebrow{color:var(--sand);font-size:.8rem;letter-spacing:.02em}
.page-head h1{margin:.35rem 0 .2rem;font-size:1.6rem}
.meta{color:var(--text2);font-size:.85rem}
.chips{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
.chip{text-decoration:none;font-size:.85rem;padding:.3rem .8rem;border-radius:100px;
  border:1px solid var(--border2);color:var(--text2);background:var(--bg2)}
.chip-ok{border-color:var(--accent);color:var(--accent);background:#fff}
.chip-missing{opacity:.65;text-decoration:line-through}
.alert{margin-top:1rem;padding:.6rem .9rem;border-radius:10px;font-size:.9rem;
  background:#FBEDE8;border:1px solid #E7C4B7;color:#7A3A28}
.alert-ok{background:#EDF3EC;border-color:#C3D8BF;color:#3B5C35}
.stage{margin-bottom:1rem}
.stage details{background:var(--card);border:1px solid var(--border);border-radius:14px;
  overflow:hidden}
.stage summary{cursor:pointer;list-style:none;padding:.9rem 1.25rem;display:flex;
  align-items:center;gap:.7rem;background:var(--bg2);font-weight:600}
.stage summary::-webkit-details-marker{display:none}
.stage-num{display:inline-flex;align-items:center;justify-content:center;
  width:1.7rem;height:1.7rem;border-radius:100px;background:var(--accent);color:#fff;
  font-size:.85rem;flex:none}
.stage-title{flex:1}
.badge{font-size:.72rem;padding:.15rem .6rem;border-radius:100px;font-weight:500}
.badge-ok{background:#E6EFE4;color:#3B5C35}
.badge-missing{background:#EFEAE6;color:var(--muted)}
.path{padding:.45rem 1.25rem;font-family:ui-monospace,Consolas,monospace;
  font-size:.78rem;color:var(--text2);background:#F4F1EC;border-bottom:1px solid var(--border);
  direction:ltr;text-align:left}
.stage-body{padding:1.1rem 1.5rem 1.6rem}
.stage-body h2{font-size:1.3rem;margin:1.6rem 0 .5rem;padding-bottom:.3rem;
  border-bottom:2px solid var(--border)}
.stage-body h3{font-size:1.1rem;margin:1.3rem 0 .4rem;color:var(--accent2)}
.stage-body h4,.stage-body h5,.stage-body h6{font-size:.98rem;margin:1rem 0 .3rem}
.stage-body p{margin:.6rem 0}
.stage-body hr{border:0;border-top:1px solid var(--border);margin:1.6rem 0}
code{font-family:ui-monospace,Consolas,monospace;font-size:.86em;
  background:#F1EDE7;padding:.1rem .35rem;border-radius:5px;
  direction:ltr;unicode-bidi:isolate}
pre.snippet{background:#2C2826;color:#F2EEE8;padding:1rem 1.15rem;border-radius:10px;
  overflow-x:auto;direction:rtl;text-align:right;white-space:pre-wrap;
  word-break:break-word;font-size:.9rem;line-height:1.7}
pre.snippet code{background:none;padding:0;color:inherit;font-family:inherit}
.table-wrap{overflow-x:auto;margin:.9rem 0}
table{border-collapse:collapse;width:100%;font-size:.9rem}
th,td{border:1px solid var(--border);padding:.45rem .7rem;text-align:right;vertical-align:top}
th{background:var(--bg2);font-weight:600}
.callout{border:1px solid var(--border2);border-right:4px solid var(--accent);
  background:#FAF7F3;border-radius:10px;padding:.7rem 1rem;margin:1rem 0}
.callout-title{font-weight:700;margin-bottom:.3rem;color:var(--accent2)}
.callout p:first-child{margin-top:0}
.callout p:last-child{margin-bottom:0}
.wiki{color:var(--accent);border-bottom:1px dotted var(--accent)}
.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.1rem}
figure{margin:0;background:var(--bg2);border:1px solid var(--border);border-radius:10px;
  padding:.6rem;text-align:center}
figure img{width:100%;height:auto;border-radius:6px;display:block}
figcaption{font-size:.78rem;color:var(--text2);margin-top:.5rem;direction:ltr}
.btn{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;
  padding:.6rem 1.6rem;border-radius:100px;font-weight:600}
.btn:hover{background:var(--accent2)}
a{color:var(--accent)}
.empty{color:var(--muted);font-style:italic}
.hint{color:var(--text2);font-size:.88rem}
.muted{color:var(--muted)}
@media(max-width:600px){.wrap{padding:1rem .8rem 4rem}.stage-body{padding:.9rem 1rem 1.2rem}}
'@

$doc = @"
<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>סקירה: $($target.Topic) ריצה $($target.Run)</title>
<style>
$css
</style>
</head>
<body>
<div class="wrap">
$($html.ToString())
</div>
</body>
</html>
"@

$reviewDir = Join-Path $RepoRoot 'review'
if (-not (Test-Path -LiteralPath $reviewDir)) {
    New-Item -ItemType Directory -Path $reviewDir | Out-Null
}

$outFile = Join-Path $reviewDir "$slug-review.html"
Set-Content -LiteralPath $outFile -Value $doc -Encoding UTF8

Write-Host ""
Write-Host "  ✔ דף הסקירה נבנה" -ForegroundColor Green
Write-Host "    $((Resolve-Path -LiteralPath $outFile).Path)"
Write-Host ""
Write-Host ("    שלב 1 קופי        {0}" -f $(if ($true) { 'קיים' } else { 'לא רץ' }))
Write-Host ("    שלב 2 ערכת שטח    {0}" -f $(if ($kitExists) { 'קיים' } else { 'לא רץ' }))
Write-Host ("    שלב 3 קריאייטיב   {0}" -f $(if ($pngs.Count -gt 0) { "$($pngs.Count) תמונות" } else { 'לא רץ' }))
Write-Host ("    שלב 4 דף נחיתה    {0}" -f $(if ($landingExists) { 'קיים' } else { 'לא רץ' }))
Write-Host ("    שלב 5 ערכת שליחה  {0}" -f $(if ($sendExists) { 'קיים' } else { 'לא רץ' }))
Write-Host ""

if ($Open) { Start-Process $outFile }
exit 0
