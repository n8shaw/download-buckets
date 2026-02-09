# Download Buckets - Release Checklist

Delete this file after release is complete.

---

## Step 1: Chrome Web Store ($5 one-time fee)

1. Go to https://chrome.google.com/webstore/developer/dashboard
2. Sign in with Google account
3. Pay $5 developer registration fee
4. Click "New Item"
5. Zip the `extension/` folder (just the folder contents, not the folder itself)
6. Upload the zip file
7. Fill in store listing:
   - **Name**: Download Buckets
   - **Description**: Sort downloads into folders with one click
   - **Category**: Productivity
   - **Screenshots**: Take 2-3 screenshots of the overlay/popup
8. Add privacy policy: "This extension does not collect any user data."
9. Submit for review (takes 1-3 days)
10. **COPY YOUR EXTENSION ID** (shown in dashboard, looks like `abcdefghijklmnopqrstuvwxyz`)

---

## Step 2: Update Installer with Extension ID

1. Open `installer/installer.iss`
2. Find this line near the top:
   ```
   #define ExtensionID "YOUR_EXTENSION_ID_HERE"
   ```
3. Replace `YOUR_EXTENSION_ID_HERE` with your actual extension ID

---

## Step 3: Compile the Installer

1. Download Inno Setup: https://jrsoftware.org/isinfo.php
2. Install it
3. Open `installer/installer.iss` with Inno Setup
4. Press Ctrl+F9 or click Build > Compile
5. Output: `dist/DownloadBuckets-Setup.exe`

---

## Step 4: Create GitHub Repository

1. Create new repo: `download-buckets`
2. Push code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/download-buckets.git
   git push -u origin main
   ```

---

## Step 5: Create GitHub Release

1. Go to your repo > Releases > Create new release
2. Tag: `v2.3`
3. Title: `Download Buckets v2.3`
4. Description:
   ```
   ## Installation
   1. Install extension from Chrome Web Store: [link]
   2. Download and run DownloadBuckets-Setup.exe below
   3. Reload the extension
   ```
5. Attach: `dist/DownloadBuckets-Setup.exe`
6. Publish

---

## Step 6: Update README with Links

Update `README.md` with:
- Chrome Web Store link
- GitHub Releases link

---

## Done! 🎉

Your extension is now live. Delete this file.
