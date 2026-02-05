@echo off
:: CHANGE THIS PATH TO YOUR ACTUAL HOST FOLDER PATH
SET "HOST_PATH=C:\Users\nshaw0\Desktop\BucketProject\host"

REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.nate.bucket_sorter" /ve /t REG_SZ /d "%HOST_PATH%\host_manifest.json" /f
echo Registration Complete!
pause