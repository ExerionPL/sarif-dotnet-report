using namespace System.IO

param (
	[Alias('s')]
    [string] $solutionPath = ".",
	[Alias('r')]
	[string] $reportDir = "",
    [Alias("o")]
    [switch] $openReport = $false
)

$rootDir = [Path]::GetDirectoryName($solutionPath)
if (-not [Path]::IsPathRooted($rootDir))
{
    $rootDir = [Path]::GetFullPath($rootDir)
	$solutionPath = [Path]::Combine($rootDir, [Path]::GetFileName($solutionPath))
}

Write-Host "Using root path: '" -NoNewLine
Write-Host $rootDir -ForegroundColor Cyan -NoNewLine
Write-Host "'"

if (![Path]::IsPathRooted($reportDir))
{
	$reportDir = [Path]::Combine($rootDir, $reportDir)
}
$reportPath = [Path]::Combine($reportDir, "index.html")

if (Test-Path $reportDir)
{
	Write-Host "Removing previous report ... " -NoNewline
    Remove-Item -LiteralPath $reportDir -Force -Recurse
	Write-Host "[Done]" -ForegroundColor Green -NoNewline
}
Write-Host "Creating report directory ... " -NoNewline
New-Item $reportDir -ItemType Directory | Out-Null
Write-Host "[Done]" -ForegroundColor Green -NoNewline

$reportFilePath = [Path]::Combine($reportDir, "out.sarif")

Write-Host "Executing '" -NoNewline
Write-Host "Security Code Scan" -ForegroundColor Cyan -NoNewline
Write-Host "' ..."

dotnet security-scan $solutionPath --export=$reportFilePath -v -ignore-msbuild-errors -p="**\*.Test*.csproj;*.dcproj"

Write-Host "Generating final json ... " -NoNewline
$reportObject = Get-Content $reportFilePath | ConvertFrom-Json
$reportObject.runs | ForEach-Object {
    $_.results | ForEach-Object {
        $_.locations | ForEach-Object {
            $region = $_.physicalLocation.region;
            $fileContent = Get-Content $_.physicalLocation.artifactLocation.uri.Substring(8)
            $codeBuilder = New-Object System.Text.StringBuilder
            $marginLines = 2;
            $startLine = [Math]::Max($region.startLine - 1 - $marginLines, 0)
            $endLine = [Math]::Min($region.endLine - 1 + $marginLines, $fileContent.Length)
            for ($lineIndex = $startLine; $lineIndex -le $endLine; $lineIndex++)
            {
                $codeBuilder.AppendLine($fileContent[$lineIndex]) | Out-Null
            }
            $code = @{
                "text" = $codeBuilder.ToString();
                "startLine" = $startLine + 1;
                "endLine" = $endLine + 1;
            }

            $_.physicalLocation | Add-Member -MemberType NoteProperty -Name "code" -Value $code -Force
        }
    }
}

$reportJson = $reportObject | ConvertTo-Json -Compress -Depth 20
$reportJson | Set-Content -Path $reportFilePath
Write-Host "[Done]" -ForegroundColor Green

Write-Host "Generating final report: '" -NoNewLine
Write-Host $reportPath -ForegroundColor Cyan -NoNewLine
Write-Host "' ... " -NoNewLine
$reportTemplate = Get-Content ([Path]::Combine($rootDir, "Tests", "SecurityCodeScan", "report.template.html")) | Out-String
$reportTemplate.Replace("##REPORT_JSON##", $reportJson) | Set-Content -Path $reportPath
Write-Host "[Done]" -ForegroundColor Green

if ($openReport)
{
    Write-Host "Opening report ..."
    Invoke-Expression "start '$($reportPath)'"
}