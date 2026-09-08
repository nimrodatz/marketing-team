<#
.SYNOPSIS
    Craft & System - local static server for verifying a stage 4 landing page.

.DESCRIPTION
    The landing agent has no browser and cannot see what it builds, so the visual
    check falls to a human. This serves one landing folder over the LAN so the page
    can be opened on a real phone WITHOUT publishing it to the internet.

    Nothing leaves the local network. No upload, no host, no DNS.

    Uses TcpListener rather than HttpListener on purpose: HttpListener needs a
    `netsh http add urlacl` registration and therefore an elevated prompt, and a
    verification tool is not worth an admin shell.

.EXAMPLE
    pwsh -File scripts/serve-landing.ps1 -Root "output/landing/2026-09-08-peer-warm-group-run2"
    pwsh -File scripts/serve-landing.ps1 -Root "output/landing/<dir>" -Port 8080
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Root,

    [ValidateRange(1024, 65535)]
    [int]$Port = 8080
)

$ErrorActionPreference = 'Stop'

$rootPath = (Resolve-Path -LiteralPath $Root).Path
if (-not (Test-Path -LiteralPath (Join-Path $rootPath 'index.html'))) {
    Write-Error "No index.html in $rootPath. Point -Root at a landing folder."
    exit 2
}

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.webp' = 'image/webp'
    '.ico'  = 'image/x-icon'
    '.woff2' = 'font/woff2'
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
$listener.Start()

$lan = (Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
    Select-Object -First 1).IPAddress

Write-Host ""
Write-Host "  Serving : $rootPath"
Write-Host "  Local   : http://localhost:$Port/"
if ($lan) { Write-Host "  Phone   : http://${lan}:$Port/   (same Wi-Fi only)" }
Write-Host ""
Write-Host "  Local network only. Nothing is published. Ctrl+C to stop."
Write-Host ""

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            # Linger on close, or a large binary body gets truncated into an
            # ERR_CONNECTION_RESET the moment the socket is disposed.
            $client.LingerState = [System.Net.Sockets.LingerOption]::new($true, 10)
            $client.NoDelay = $true

            $stream = $client.GetStream()
            $stream.ReadTimeout = 5000
            $stream.WriteTimeout = 30000

            # Read the request line AND drain the remaining headers. Closing a
            # socket that still has unread inbound bytes makes Windows send an
            # RST, which the browser reports as ERR_CONNECTION_RESET on the
            # image responses. Draining to the blank line is what prevents it.
            $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
            $requestLine = $reader.ReadLine()
            if (-not $requestLine) { continue }
            while ($true) {
                $header = $reader.ReadLine()
                if ($null -eq $header -or $header -eq '') { break }
            }

            $target = ($requestLine -split ' ')[1]
            if (-not $target) { $target = '/' }
            $target = ($target -split '\?')[0]
            $target = [System.Uri]::UnescapeDataString($target)
            if ($target -eq '/' ) { $target = '/index.html' }

            # Path containment: never serve outside the served folder.
            $candidate = Join-Path $rootPath ($target.TrimStart('/') -replace '/', '\')
            $full = [System.IO.Path]::GetFullPath($candidate)

            $body = $null
            $status = '404 Not Found'
            $type = 'text/plain; charset=utf-8'

            if ($full.StartsWith($rootPath, [StringComparison]::OrdinalIgnoreCase) -and (Test-Path -LiteralPath $full -PathType Leaf)) {
                $body = [System.IO.File]::ReadAllBytes($full)
                $status = '200 OK'
                $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
                $type = $mime[$ext]
                if (-not $type) { $type = 'application/octet-stream' }
            }
            else {
                $body = [System.Text.Encoding]::UTF8.GetBytes('not found')
            }

            $head = "HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $($body.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
            $headBytes = [System.Text.Encoding]::ASCII.GetBytes($head)
            $stream.Write($headBytes, 0, $headBytes.Length)
            $stream.Write($body, 0, $body.Length)
            $stream.Flush()

            Write-Host "  $status  $target"
        }
        catch {
            # One bad connection must not take the server down.
        }
        finally {
            $client.Close()
        }
    }
}
finally {
    $listener.Stop()
    Write-Host ""
    Write-Host "  Stopped."
}
