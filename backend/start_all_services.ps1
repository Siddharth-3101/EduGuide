# Script to start all 13 SkillBridge Microservices concurrently on unique ports 8081-8093
# and the Unified Single-Runner Process on Port 8080

$services = @(
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

foreach ($svc in $services) {
    Write-Host "Launching [$($svc.name)] on Port $($svc.port)..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PSScriptRoot\$($svc.folder)'; mvn spring-boot:run`""
}

Write-Host "`nAll 13 microservices are launching in dedicated processes!" -ForegroundColor Gold
Write-Host "Swagger UI links available at http://localhost:8081/swagger-ui.html through 8093!" -ForegroundColor Gold
