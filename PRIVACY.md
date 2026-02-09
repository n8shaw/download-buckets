# Privacy Policy - Download Buckets

**Last updated:** February 9, 2026

## Data Collection

Download Buckets does **not** collect, store, or transmit any user data.

## What the Extension Does

- Detects when a file download completes
- Displays a sorting overlay on the active tab
- Stores your bucket names and folder paths **locally** using Chrome's storage API
- Communicates with a local companion app to move files to your chosen folders

## Data Storage

All configuration data (bucket names and folder paths) is stored locally on your device using Chrome's `chrome.storage.local` API. This data never leaves your device.

## Third-Party Services

This extension does not use any third-party services, analytics, or tracking.

## Permissions

The extension requests only the permissions necessary to function:

| Permission | Purpose |
|------------|---------|
| downloads | Detect completed downloads |
| storage | Save bucket configuration locally |
| nativeMessaging | Communicate with local companion app |
| activeTab / scripting | Display sorting overlay on current tab |

## Contact

If you have questions about this privacy policy, please open an issue on the [GitHub repository](https://github.com/n8shaw/download-buckets/issues).
