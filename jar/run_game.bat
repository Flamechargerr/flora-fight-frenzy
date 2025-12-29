@echo off
REM ========================================
REM Plants vs Zombies - By Anamay (Flamechargerr)
REM ========================================

echo Starting Plants vs Zombies...
echo Built by Anamay (Flamechargerr)
echo.

set JAVAFX_PATH=c:\Users\anama\OneDrive\Desktop\plant\javafx-sdk-17.0.2\lib

java --module-path "%JAVAFX_PATH%" --add-modules javafx.controls,javafx.fxml,javafx.graphics,javafx.media -jar PlantVsZombies.jar

pause
