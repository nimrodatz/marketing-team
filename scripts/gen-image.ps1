<#
.SYNOPSIS
    Craft & System — image generation wrapper for the OpenAI Images API.

.DESCRIPTION
    One call: loads .env, hits the API, decodes the base64 payload, writes a PNG.
    The model is hard-locked to gpt-image-2 and the Zero-Text rule is enforced
    mechanically before a single agora is spent.

    Called by the `gpt-image-gen` skill and by the `creative` agent.
    Runnable by hand for verification.

.EXAMPLE
    pwsh -File scripts/gen-image.ps1 `
        -Prompt "a construction site at golden hour, no text, no letters, no words, no signage, no captions" `
        -OutFile "creative/test.png"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Prompt,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$OutFile,

    [ValidateSet('1024x1024', '1024x1536', '1536x1024')]
    [string]$Size = '1024x1024',

    [ValidateSet('low', 'medium', 'high')]
    [string]$Quality = 'medium'
)

$ErrorActionPreference = 'Stop'

# ─────────────────────────────────────────────────────────────────────────────
# IRON RULE 1 — the model is a constant, not a parameter.
# gpt-image-2 is the locked decision for this project. Not gpt-image-1,
# not dall-e-3. There is deliberately no switch to override this.
# ─────────────────────────────────────────────────────────────────────────────
$Model = 'gpt-image-2'

# ─────────────────────────────────────────────────────────────────────────────
# IRON RULE 2 — Zero-Text gate. Blocking, and it runs BEFORE the paid call.
# Image engines do not render Hebrew correctly, so every image this project
# produces is text-free and the Hebrew is layered on top in code. Relying on
# the agent to remember the clause is not enforcement; this is.
# ─────────────────────────────────────────────────────────────────────────────
$ZeroTextClause = 'no text, no letters, no words, no signage, no captions'

if ($Prompt -notlike "*$ZeroTextClause*") {
    Write-Error @"
Zero-Text gate: refused before spending anything.

The prompt must contain this clause verbatim:
    $ZeroTextClause

Append it to the end of the prompt and run again.
"@
    exit 2
}

# ─── Load the API key from .env ──────────────────────────────────────────────
# The key is never echoed, never logged, and never placed on a command line.
$repoRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $repoRoot '.env'

if (-not (Test-Path $envFile)) {
    Write-Error ".env not found at $envFile. Copy .env.example and fill in OPENAI_API_KEY."
    exit 1
}

$apiKey = $null
foreach ($line in Get-Content $envFile) {
    if ($line -match '^\s*OPENAI_API_KEY\s*=\s*(.+?)\s*$') {
        $apiKey = $Matches[1].Trim([char]34, [char]39)
    }
}

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Error "OPENAI_API_KEY is missing or empty in $envFile."
    exit 1
}

# ─── Resolve the output path and make sure its folder exists ─────────────────
if (-not [IO.Path]::IsPathRooted($OutFile)) {
    $OutFile = Join-Path $repoRoot $OutFile
}
if ($OutFile -notmatch '\.png$') { $OutFile = "$OutFile.png" }

$outDir = Split-Path -Parent $OutFile
if ($outDir -and -not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

# ─── Call the API ────────────────────────────────────────────────────────────
# The body goes through ConvertTo-Json rather than a hand-built string: prompts
# carry commas, quotes and sometimes Hebrew, and manual JSON breaks on all three.
$body = @{
    model         = $Model
    prompt        = $Prompt
    size          = $Size
    quality       = $Quality
    output_format = 'png'
} | ConvertTo-Json -Depth 4 -Compress

Write-Host "model: $Model | size: $Size | quality: $Quality"
Write-Host "generating -> $OutFile"

try {
    $response = Invoke-RestMethod `
        -Uri 'https://api.openai.com/v1/images/generations' `
        -Method Post `
        -Headers @{ 'Authorization' = "Bearer $apiKey" } `
        -ContentType 'application/json; charset=utf-8' `
        -Body ([Text.Encoding]::UTF8.GetBytes($body))
}
catch {
    # Report the API's own message. Never retry automatically, and never fall
    # back to a different model — that would silently break the iron rule.
    $detail = $_.ErrorDetails.Message
    if (-not $detail) { $detail = $_.Exception.Message }
    Write-Error "Images API call failed: $detail"
    exit 1
}

$b64 = $response.data[0].b64_json
if ([string]::IsNullOrWhiteSpace($b64)) {
    Write-Error "The API returned no image payload. Nothing was written."
    exit 1
}

# ─── Decode straight to disk ─────────────────────────────────────────────────
# No temporary response.json: nothing to clean up, nothing to leak.
[IO.File]::WriteAllBytes($OutFile, [Convert]::FromBase64String($b64))

$written = Get-Item $OutFile
if ($written.Length -le 0) {
    Write-Error "The PNG was written but is empty: $OutFile"
    exit 1
}

$kb = [math]::Round($written.Length / 1KB, 1)
Write-Host "ok: $OutFile ($kb KB)"
exit 0
