param(
  [string]$ApiBase = "http://localhost:8765",
  [string]$UserId = "default_user"
)

$targetPath = Join-Path $env:USERPROFILE ".codex\config.toml"
$targetDir = Split-Path $targetPath -Parent
if (!(Test-Path $targetDir)) {
  New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}
if (!(Test-Path $targetPath)) {
  New-Item -ItemType File -Path $targetPath -Force | Out-Null
}

$snippet = @"
[mcp_servers.openmemory-local]
command = "cmd"
args = [
    "/c",
    "npx",
    "-y",
    "supergateway",
    "--sse",
    "$ApiBase/mcp/codex/sse/$UserId"
]
env = { SystemRoot="C\Windows" }
startup_timeout_ms = 20_000
"@

$pattern = '\[mcp_servers\.openmemory-local\][\s\S]*?(?=\r?\n\[|$)'
$content = if (Test-Path $targetPath) { Get-Content $targetPath -Raw } else { "" }

if ($content -match $pattern) {
  $content = [regex]::Replace($content, $pattern, $snippet)
} else {
  if ($content.Trim().Length -gt 0) {
    $content += [Environment]::NewLine + [Environment]::NewLine
  }
  $content += $snippet
}

Set-Content -Path $targetPath -Value $content -Encoding UTF8
Write-Output "Updated codex config at $targetPath"
