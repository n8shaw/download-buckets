# Download Buckets

A Chrome extension that lets you quickly sort downloads into predefined folders (buckets) with one click.

![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Windows](https://img.shields.io/badge/Platform-Windows-0078D6?logo=windows)

## Features

- 📁 **Bucket Sorting** - Create named folder shortcuts for quick organization
- 🎯 **One-Click Sorting** - Click a bucket to move your download instantly
- 📂 **Custom Location** - "Choose Location..." for ad-hoc folder selection
- 🔔 **Smart Overlay** - Appears automatically when downloads complete

## Installation

### 1. Install the Chrome Extension

[**Install from Chrome Web Store**](#) *(link coming soon)*

Or load unpacked from the `extension/` folder in Developer Mode.

### 2. Install the Companion App (Required)

The extension requires a companion app to move files on your system.

**Windows:**
1. Download `DownloadBuckets-Setup.exe` from [**Releases**](../../releases/latest)
2. Run the installer
3. Reload the extension in Chrome

## Usage

1. **Click the extension icon** to open bucket settings
2. **Add buckets** by naming them and selecting a folder
3. **Download any file** - an overlay will appear
4. **Click a bucket** to sort, or use "Choose Location..."

## Building from Source

### Extension
Load the `extension/` folder as an unpacked extension in `chrome://extensions` (Developer Mode).

### Companion App (Windows)
```bash
cd host
pip install pyinstaller
pyinstaller --onefile --noconsole bucket_engine.py
```

Then use [Inno Setup](https://jrsoftware.org/isinfo.php) to compile `installer/installer.iss`.

## Project Structure

```
download-buckets/
├── extension/           # Chrome extension source
│   ├── manifest.json
│   ├── background.js
│   ├── overlay.js       # Download notification overlay
│   ├── popup.js         # Sort popup logic
│   ├── options.js       # Bucket configuration
│   └── icons/
├── host/                # Native messaging host (Python)
│   ├── bucket_engine.py
│   └── host_manifest.json.template
├── installer/           # Inno Setup installer script
│   └── installer.iss
└── scripts/             # Build utilities
    └── build.py
```

## Privacy

This extension does not collect, store, or transmit any user data. All operations are performed locally on your device.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License - see [LICENSE](LICENSE)
