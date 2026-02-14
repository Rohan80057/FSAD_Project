$ErrorActionPreference = "SilentlyContinue"

Write-Host "Searching for Java 17..."
$Java17Path = $null

# Check common locations
$CommonPaths = @(
    "C:\Program Files\Java\jdk-17*",
    "C:\Program Files\Java\jdk17*",
    "$env:USERPROFILE\.jdks\temurin-17*",
    "$env:USERPROFILE\.jdks\corretto-17*",
    "$env:ProgramFiles\Eclipse Adoptium\jdk-17*"
)

foreach ($path in $CommonPaths) {
    $found = Get-Item $path | Sort-Object Name -Descending | Select-Object -First 1
    if ($found) {
        $Java17Path = $found.FullName
        break
    }
}

if ($Java17Path) {
    Write-Host "Found Java 17 at: $Java17Path"
    $env:JAVA_HOME = $Java17Path
    $env:Path = "$Java17Path\bin;$env:Path"
} else {
    Write-Host "Could not auto-detect Java 17. Using system default Java."
    java -version
}

Write-Host "Running Maven..."
mvn clean spring-boot:run
