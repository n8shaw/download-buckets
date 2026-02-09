# Download Buckets

A Chrome extension that lets you quickly sort downloads into predefined folders (buckets) with one click.

![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- 📁 **Bucket Sorting** - Create named folder shortcuts for quick organization
- 🎯 **One-Click Sorting** - Click a bucket to move your download instantly
- 📂 **Custom Location** - "Choose Location..." for ad-hoc folder selection
- 🔔 **Smart Overlay** - Appears automatically when downloads complete

## Installation

### 1. Install the Chrome Extension

- Install from [Chrome Web Store](#) *(link coming soon)*
- Or load unpacked from the `extension/` folder in Developer Mode

### 2. Install the Companion App

The extension requires a small companion app to move files on your system.

**Windows:**
1. Download `DownloadBuckets-Setup.exe` from [Releases](../../releases)
2. Run the installer
3. Reload the extension

## Usage

1. Click the extension icon → **Options**
2. Add buckets by naming them and selecting a folder
3. Download any file
4. Click a bucket in the overlay to sort, or use "Choose Location..."

## Building from Source

### Extension
Load the `extension/` folder as an unpacked extension in Chrome.

### Companion App
```bash
cd host
pip install pyinstaller
pyinstaller --onefile --noconsole bucket_engine.py
```

## Privacy

This extension does not collect, store, or transmit any user data. All operations are performed locally on your device.

## License

MIT License - see [LICENSE](LICENSE)
