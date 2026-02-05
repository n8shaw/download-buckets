document.addEventListener('DOMContentLoaded', () => {
    chrome.downloads.search({limit: 1, orderBy: ['-startTime']}, (items) => {
        const display = document.getElementById('filename-display');
        
        if (!items || items.length === 0) {
            display.textContent = "No recent downloads";
            return;
        }

        const fullFilename = items[0].filename.split(/[/\\]/).pop();
        display.textContent = fullFilename;
        display.dataset.full = fullFilename;
        
        loadBuckets();
    });
});

function loadBuckets() {
    chrome.storage.local.get(['buckets'], (result) => {
        const buckets = result.buckets || [];
        const list = document.getElementById('bucket-list');

        if (buckets.length === 0) {
            list.innerHTML = "<div style='grid-column: span 2; text-align: center; color: #999; font-size: 12px;'>No buckets set.<br>Right-click icon > Options</div>";
            return;
        }

        buckets.forEach(bucket => {
            const btn = document.createElement('button');
            btn.className = "bucket-btn"; // Uses the new Pill CSS
            btn.textContent = bucket.name;
            btn.onclick = () => performMove(bucket.path, bucket.name);
            list.appendChild(btn);
        });
    });
}

function performMove(path, bucketName) {
    const filename = document.getElementById('filename-display').dataset.full;
    const statusDiv = document.getElementById('status');

    statusDiv.textContent = "Moving...";
    statusDiv.style.color = "#5f6368";
    statusDiv.style.opacity = "1";

    chrome.runtime.sendNativeMessage('com.nate.bucket_sorter',
        { action: "move_file", filename: filename, destination: path },
        (response) => {
            if (response && response.status === "success") {
                statusDiv.innerHTML = `✅ Moved to <b>${bucketName}</b>`;
                statusDiv.style.color = "#188038"; // Google Green
                
                // Close faster for a snappier feel
                setTimeout(() => window.close(), 1000);
            } else {
                statusDiv.textContent = "Error moving file";
                statusDiv.style.color = "#d93025";
            }
        }
    );
}