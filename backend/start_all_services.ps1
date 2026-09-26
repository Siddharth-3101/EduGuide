# Script to start all 13 SkillBridge Microservices concurrently on unique ports 8081-8093
# and the Unified Single-Runner Process on Port 8080

# Auto-detect Maven path if not globally on PATH
$mavenKnownPaths = @(
    "C:\Users\siddh\git\AgriSmart-main\maven\apache-maven-3.9.6\bin"
)
foreach ($p in $mavenKnownPaths) {
    if (Test-Path "$p\mvn.cmd") {
        $env:PATH = "$p;" + $env:PATH
        $detectedMavenBin = $p
        break
    }
}

$services = @(
    @{ name = "SkillBridge Unified Runner"; folder = "skillbridge-runner"; port = 8080 },
    @{ name = "Auth Service"; folder = "auth-service"; port = 8081 },
    @{ name = "Profile Service"; folder = "profile-service"; port = 8082 },
    @{ name = "Career Service"; folder = "career-service"; port = 8083 },
    @{ name = "Skill Service"; folder = "skill-service"; port = 8084 },
    @{ name = "Evidence Service"; folder = "evidence-service"; port = 8085 },
    @{ name = "Assessment Service"; folder = "assessment-service"; port = 8086 },
    @{ name = "Learning Service"; folder = "learning-service"; port = 8087 },
    @{ name = "Project Service"; folder = "project-service"; port = 8088 },
    @{ name = "Job Service"; folder = "job-service"; port = 8089 },
    @{ name = "Portfolio Service"; folder = "portfolio-service"; port = 8090 },
    @{ name = "Notification Service"; folder = "notification-service"; port = 8091 },
    @{ name = "Analytics Service"; folder = "analytics-service"; port = 8092 },
    @{ name = "Readiness Service"; folder = "readiness-service"; port = 8093 }
)

Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "            SkillBridge Backend Services Startup Launcher                 " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan

# Ensure shared dependencies (skillbridge-common) are installed in local .m2 repo
$commonJar = [System.IO.Path]::Combine($HOME, ".m2", "repository", "com", "skillbridge", "skillbridge-common", "1.0.0-SNAPSHOT", "skillbridge-common-1.0.0-SNAPSHOT.jar")
if (-not (Test-Path $commonJar)) {
    Write-Host "Building and installing shared library (skillbridge-common) to ~/.m2 repository..." -ForegroundColor Yellow
    Push-Location $PSScriptRoot
    mvn install -DskipTests -pl skillbridge-common -am
    Pop-Location
}

$childEnvPrefix = ""
if ($detectedMavenBin) {
    $childEnvPrefix = "`$env:PATH = '$detectedMavenBin;' + `$env:PATH; "
}

# Pass DB_PASSWORD to child processes (defaults to empty string for root without password)
$currentDbPassword = if ($env:DB_PASSWORD -ne $null) { $env:DB_PASSWORD } else { "" }
$dbEnvPrefix = "`$env:DB_PASSWORD = '$currentDbPassword'; "

foreach ($svc in $services) {
    Write-Host "Launching [$($svc.name)] on Port $($svc.port)..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit -Command `"$childEnvPrefix $dbEnvPrefix cd '$PSScriptRoot\$($svc.folder)'; mvn spring-boot:run`""
}

Write-Host "`nAll 13 microservices are launching in dedicated processes!" -ForegroundColor Gold
Write-Host "Swagger UI links available at http://localhost:8081/swagger-ui.html through 8093!" -ForegroundColor Gold
