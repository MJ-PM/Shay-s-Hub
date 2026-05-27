@echo off
echo Creating assets folder...
if not exist "assets" mkdir assets

echo Copying generated images...
copy "C:\Users\AYOO\.gemini\antigravity\brain\c4606a14-2ac3-4b00-9e1c-0d2c7c08e4a8\hero_banner_1777743418276.png" "assets\hero_banner.png" >nul
copy "C:\Users\AYOO\.gemini\antigravity\brain\c4606a14-2ac3-4b00-9e1c-0d2c7c08e4a8\joggers_1777743558776.png" "assets\joggers.png" >nul
copy "C:\Users\AYOO\.gemini\antigravity\brain\c4606a14-2ac3-4b00-9e1c-0d2c7c08e4a8\tshirt_1777743588995.png" "assets\tshirt.png" >nul
copy "C:\Users\AYOO\.gemini\antigravity\brain\c4606a14-2ac3-4b00-9e1c-0d2c7c08e4a8\sweatshirt_1777743713500.png" "assets\sweatshirt.png" >nul
copy "C:\Users\AYOO\.gemini\antigravity\brain\c4606a14-2ac3-4b00-9e1c-0d2c7c08e4a8\hoodie_1777744116363.png" "assets\hoodie.png" >nul
copy "C:\Users\AYOO\.gemini\antigravity\brain\c4606a14-2ac3-4b00-9e1c-0d2c7c08e4a8\cap_1777744279048.png" "assets\cap.png" >nul
copy "C:\Users\AYOO\.gemini\antigravity\brain\4d94d231-7be1-4605-a926-d18034556853\totebag_1777755469687.png" "assets\totebag.png" >nul

echo.
echo All images copied successfully! You are ready to deploy.
pause
