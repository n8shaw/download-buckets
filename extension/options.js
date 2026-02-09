'use strict';

/**
 * Download Buckets - Options
 * Configure bucket destinations.
 */

const NATIVE_HOST = 'com.nate.bucket_sorter';
let selectedPath = '';

document.getElementById('pickPath').onclick = pickFolder;
document.getElementById('saveBucket').onclick = saveBucket;
loadBuckets();

function pickFolder() {
    const btn = document.getElementById('pickPath');
    btn.textContent = 'Opening...';

    chrome.runtime.sendNativeMessage(NATIVE_HOST, { action: 'pick_folder' }, (response) => {
        if (response?.path) {
            selectedPath = response.path;
            btn.textContent = '✓ Selected';
            btn.classList.add('selected');
        } else {
            btn.textContent = '📂 Select Folder...';
        }
    });
}

function saveBucket() {
    const name = document.getElementById('bucketName').value.trim();
    if (!name || !selectedPath) return;

    chrome.storage.local.get(['buckets'], (res) => {
        const buckets = res.buckets || [];
        buckets.push({ name, path: selectedPath });

        chrome.storage.local.set({ buckets }, () => {
            document.getElementById('bucketName').value = '';
            document.getElementById('pickPath').textContent = '📂 Select Folder...';
            document.getElementById('pickPath').classList.remove('selected');
            selectedPath = '';
            loadBuckets();
        });
    });
}

function loadBuckets() {
    chrome.storage.local.get(['buckets'], (res) => {
        const list = document.getElementById('savedList');
        const buckets = res.buckets || [];
        list.innerHTML = '';

        buckets.forEach((bucket, i) => {
            const li = document.createElement('li');
            li.innerHTML = `
        <div style="display:flex;align-items:center;overflow:hidden">
          <b>${bucket.name}</b>
          <span class="bucket-path">${bucket.path}</span>
        </div>
        <div class="delete-btn" title="Remove">×</div>
      `;
            li.querySelector('.delete-btn').onclick = () => {
                buckets.splice(i, 1);
                chrome.storage.local.set({ buckets }, loadBuckets);
            };
            list.appendChild(li);
        });
    });
}