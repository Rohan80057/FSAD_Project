$ErrorActionPreference = "Continue"

# Get the directory where this script is located
$projectDir = $PSScriptRoot

Write-Host "Starting FSAD Project..." -ForegroundColor Green

# ====================================================================
# CONFIGURATION: Set your specific Java path here to fix version conflicts.
# Replace this with the path to your JDK 17 installation if auto-detect fails.
# Example: $SpecificJavaHome = "C:\Program Files\Java\jdk-17"
# ====================================================================
$SpecificJavaHome = "C:\Program Files\Java\jdk-17"

# Auto-detect JDK 17 if the specific path doesn't exist
if (-not (Test-Path $SpecificJavaHome)) {
    Write-Host "Warning: Specific Java path not found at '$SpecificJavaHome'." -ForegroundColor Yellow
    Write-Host "Searching for installed JDK 17..." -ForegroundColor Cyan
    
    $searchPaths = @(
        "C:\Program Files\Eclipse Adoptium\*jdk*17*", 
        "C:\Program Files\Java\*jdk*17*", 
        "C:\Program Files\Amazon Corretto\*jdk*17*"
    )
    
    $foundJdks = Get-Item $searchPaths -ErrorAction SilentlyContinue | Where-Object { $_.PSIsContainer }
    if ($foundJdks) {
        $SpecificJavaHome = $foundJdks[-1].FullName
        Write-Host "Auto-detected JDK 17 at: $SpecificJavaHome" -ForegroundColor Green
    }
    else {
        Write-Host "Could not auto-detect JDK 17. Falling back to system default JAVA_HOME or PATH." -ForegroundColor Red
        Write-Host "Please manually edit this script to set `$SpecificJavaHome to your Java 17 location if you face issues." -ForegroundColor Red
        $SpecificJavaHome = ""
    }
}
else {
    Write-Host "Using specific Java at: $SpecificJavaHome" -ForegroundColor Green
}

# The MAVEN_OPTS required for Java 16+ compatibility with older maven plugins
# (Taken directly from your start_servers.bat)
$mavenOpts = "--add-opens=jdk.compiler/com.sun.tools.javac.code=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.comp=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.main=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.model=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.parser=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.processing=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.jvm=ALL-UNNAMED"

# 1. Start Java Spring Boot Backend
$backendScriptPath = Join-Path $env:TEMP "start_fsad_backend.ps1"
$backendCmd = @"
if ('$SpecificJavaHome' -ne '') {
    `$env:JAVA_HOME = '$SpecificJavaHome'
    `$env:Path = `"`$env:JAVA_HOME\bin;`$env:Path`"
}
`$env:MAVEN_OPTS = '$mavenOpts'
Set-Location -Path '$projectDir\portfolio'
Write-Host '1. Starting Java Spring Boot Backend...' -ForegroundColor Cyan
Write-Host '----------------------------------------'
Write-Host 'Active Java version:' -ForegroundColor Yellow
java -version
Write-Host '----------------------------------------'
mvn clean spring-boot:run
Write-Host ''
Write-Host 'Backend process stopped. Press any key to close...'
`$null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
"@
Set-Content -Path $backendScriptPath -Value $backendCmd

# 2. Start React Vite Frontend
$frontendScriptPath = Join-Path $env:TEMP "start_fsad_frontend.ps1"
$frontendCmd = @"
Set-Location -Path '$projectDir\Financial Portfolio Website (1)'
Write-Host '2. Starting React Vite Frontend...' -ForegroundColor Cyan
Write-Host '----------------------------------------'
npm run dev
Write-Host ''
Write-Host 'Frontend process stopped. Press any key to close...'
`$null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
"@
Set-Content -Path $frontendScriptPath -Value $frontendCmd

# Launch the terminals
Write-Host "Opening new terminal for Backend..." -ForegroundColor Cyan
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$backendScriptPath`""

Write-Host "Opening new terminal for Frontend..." -ForegroundColor Cyan
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$frontendScriptPath`""

Write-Host "`nBoth servers are starting in separate windows." -ForegroundColor Green
Write-Host "- Backend will be available at: http://localhost:8088"
Write-Host "- Frontend will be available at: http://localhost:5173"
Write-Host "Press any key to exit this launcher..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
