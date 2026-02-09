'use strict';

/**
 * Download Buckets - Popup
 * Quick sort interface for most recent download.
 */

const NATIVE_HOST = 'com.nate.bucket_sorter';

document.addEventListener('DOMContentLoaded', async () => {
    const filenameEl = document.getElementById('filename-display');
    const listEl = document.getElementById('bucket-list');
    const statusEl = document.getElementById('status');

    const downloads = await new Promise(r => chrome.downloads.search({ limit: 1, orderBy: ['-startTime'] }, r));

    if (!downloads?.length) {
        filenameEl.textContent = 'No recent downloads';
        return;
    }

    const filename = downloads[0].filename.split(/[/\\]/).pop();
    filenameEl.textContent = filename;

    const { buckets = [] } = await new Promise(r => chrome.storage.local.get(['buckets'], r));

    if (!buckets.length) {
        listEl.innerHTML = '<div style="grid-column:span 2;text-align:center;color:#999;font-size:12px">No buckets configured</div>';
    }

    buckets.forEach((bucket) => {
        const btn = document.createElement('button');
        btn.className = 'bucket-btn';
        btn.textContent = bucket.name;
        btn.onclick = () => moveFile(bucket.path, bucket.name);
        listEl.appendChild(btn);
    });

    const customBtn = document.createElement('button');
    customBtn.className = 'bucket-btn btn-custom';
    customBtn.textContent = '📁 Choose Location...';
    customBtn.onclick = pickAndMove;
    listEl.appendChild(customBtn);

    function moveFile(path, name) {
        showStatus('Moving...', '#5f6368');
        chrome.runtime.sendNativeMessage(NATIVE_HOST, {
            action: 'move_file', filename, destination: path
        }, (response) => handleResponse(response, name));
    }

    function pickAndMove() {
        showStatus('Opening picker...', '#5f6368');
        chrome.runtime.sendNativeMessage(NATIVE_HOST, {
            action: 'pick_and_move', filename
        }, (response) => {
            if (response?.status === 'cancelled') {
                statusEl.textContent = '';
            } else {
                const name = response?.path?.split(/[/\\]/).pop() || 'folder';
                handleResponse(response, name);
            }
        });
    }

    function handleResponse(response, name) {
        if (response?.status === 'success') {
            showStatus(`✅ Moved to <b>${name}</b>`, '#188038');
            setTimeout(() => window.close(), 1000);
        } else {
            showStatus('Error moving file', '#d93025');
        }
    }

    function showStatus(msg, color) {
        statusEl.innerHTML = msg;
        statusEl.style.color = color;
    }
});