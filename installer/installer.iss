; Download Buckets Installer
; Inno Setup Script - https://jrsoftware.org/isinfo.php

#define MyAppName "Download Buckets"
#define MyAppVersion "2.3"
#define MyAppPublisher "Nate Shaw"
#define MyAppURL "https://github.com/n8shaw/download-buckets"

; IMPORTANT: Update this with your Chrome extension ID after publishing
#define ExtensionID "YOUR_EXTENSION_ID_HERE"

[Setup]
AppId={{8F3C2B1A-4D5E-6F7A-8B9C-0D1E2F3A4B5C}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
DefaultDirName={localappdata}\DownloadBuckets
DisableProgramGroupPage=yes
OutputDir=..\dist
OutputBaseFilename=DownloadBuckets-Setup
Compression=lzma
SolidCompression=yes
PrivilegesRequired=lowest

[Files]
Source: "..\dist\bucket_engine.exe"; DestDir: "{app}"; Flags: ignoreversion

[Registry]
Root: HKCU; Subkey: "Software\Google\Chrome\NativeMessagingHosts\com.nate.bucket_sorter"; ValueType: string; ValueData: "{app}\host_manifest.json"; Flags: uninsdeletekey

[Code]
procedure CurStepChanged(CurStep: TSetupStep);
var
  ManifestContent: string;
  ManifestPath: string;
begin
  if CurStep = ssPostInstall then
  begin
    ManifestPath := ExpandConstant('{app}\host_manifest.json');
    ManifestContent := '{' + #13#10 +
      '  "name": "com.nate.bucket_sorter",' + #13#10 +
      '  "description": "Download Buckets Native Host",' + #13#10 +
      '  "path": "' + ExpandConstant('{app}\bucket_engine.exe') + '",' + #13#10 +
      '  "type": "stdio",' + #13#10 +
      '  "allowed_origins": [' + #13#10 +
      '    "chrome-extension://{#ExtensionID}/"' + #13#10 +
      '  ]' + #13#10 +
      '}';
    SaveStringToFile(ManifestPath, ManifestContent, False);
  end;
end;

[UninstallDelete]
Type: files; Name: "{app}\host_manifest.json"
