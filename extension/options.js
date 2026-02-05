let currentPath = "";

document.getElementById('pickPath').addEventListener('click', () => {
    const btn = document.getElementById('pickPath');
    btn.textContent = "Opening Picker...";
    
    chrome.runtime.sendNativeMessage('com.nate.bucket_sorter', { action: "pick_folder" }, (response) => {
        if (response && response.path) {
            currentPath = response.path;
            btn.textContent = "✓ Folder Selected";
            btn.classList.add('selected');
        } else {
            btn.textContent = "📂 Select Folder...";
        }
    });
});

document.getElementById('saveBucket').addEventListener('click', () => {
    const name = document.getElementById('bucketName').value;
    if (!name || !currentPath) return; // Simple validation

    chrome.storage.local.get(['buckets'], (res) => {
        const buckets = res.buckets || [];
        buckets.push({ name: name, path: currentPath });
        
        chrome.storage.local.set({ buckets: buckets }, () => {
            // Reset Form
            document.getElementById('bucketName').value = "";
            document.getElementById('pickPath').textContent = "📂 Select Folder...";
            document.getElementById('pickPath').classList.remove('selected');
            currentPath = "";
            loadBuckets();
        });
    });
});

function loadBuckets() {
    chrome.storage.local.get(['buckets'], (res) => {
        const list = document.getElementById('savedList');
        list.innerHTML = "";
        
        (res.buckets || []).forEach((b, index) => {
            const li = document.createElement('li');
            
            // Create the HTML for the list item
            li.innerHTML = `
                <div style="display:flex; align-items:center; overflow:hidden;">
                    <b>${b.name}</b>
                    <span class="bucket-path">${b.path}</span>
                </div>
                <div class="delete-btn" title="Remove">×</div>
            `;

            // Add Delete Logic
            li.querySelector('.delete-btn').onclick = () => {
                const newBuckets = res.buckets.filter((_, i) => i !== index);
                chrome.storage.local.set({ buckets: newBuckets }, loadBuckets);
            };

            list.appendChild(li);
        });
    });
}
loadBuckets();