// Listen for the "Start" command from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "init_overlay") {
        createOverlay(request.filename);
    }
});

function createOverlay(filename) {
    // 1. Remove existing overlay if present
    const existing = document.getElementById('bucket-sorter-root');
    if (existing) existing.remove();

    // 2. Create Shadow DOM (Isolates our styles from the website's styles)
    const rootHost = document.createElement('div');
    rootHost.id = 'bucket-sorter-root';
    const shadow = rootHost.attachShadow({mode: 'open'});
    document.body.appendChild(rootHost);

    // 3. Define the HTML and CSS
    const style = `
        .overlay-container {
            position: fixed;
            bottom: 20px; /* ANCHOR TO BOTTOM */
            right: 20px;  /* ANCHOR TO RIGHT */
            width: 320px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.15); /* Softer shadow */
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            z-index: 2147483647;
            padding: 20px;
            animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); /* Smooth "Apple-like" pop */
            border: 1px solid rgba(0,0,0,0.08);
        }

        /* Animation: Slide UP from bottom */
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        
        .icon { 
            width: 40px; height: 40px; background: #e8f0fe; 
            border-radius: 12px; display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .icon svg { width: 24px; height: 24px; fill: #1967d2; }
        
        .title-group { overflow: hidden; display: flex; flex-direction: column; }
        
        .filename { 
            font-size: 14px; font-weight: 600; color: #202124; 
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; 
        }
        
        .subtitle { font-size: 12px; color: #5f6368; margin-top: 2px; }
        
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        
        .btn {
            background: #fff; border: 1px solid #dadce0; color: #3c4043;
            padding: 10px; border-radius: 20px; font-size: 13px; font-weight: 500;
            cursor: pointer; transition: all 0.2s;
        }
        
        .btn:hover { background: #f1f3f4; border-color: #dadce0; color: #202124; transform: translateY(-1px); }
        
        .close-btn {
            position: absolute; top: 12px; right: 12px; cursor: pointer;
            color: #dadce0; font-size: 20px; line-height: 1; border: none; background: none; padding: 4px;
        }
        .close-btn:hover { color: #5f6368; }
        
        .status { margin-top: 12px; text-align: center; font-size: 12px; display: none; }
    `;

    // 4. Build the internal HTML structure
    const container = document.createElement('div');
    container.className = 'overlay-container';
    container.innerHTML = `
        <style>${style}</style>
        <button class="close-btn">×</button>
        <div class="header">
            <div class="icon">
                <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
            </div>
            <div class="title-group">
                <div class="filename">${filename}</div>
                <div class="subtitle">Sort this download</div>
            </div>
        </div>
        <div class="grid" id="bucket-grid"></div>
        <div class="status" id="status-msg"></div>
    `;

    shadow.appendChild(container);

    // 5. Close Button Logic
    container.querySelector('.close-btn').onclick = () => rootHost.remove();

    // 6. Load Buckets & Add Click Listeners
    chrome.storage.local.get(['buckets'], (res) => {
        const grid = container.querySelector('#bucket-grid');
        const buckets = res.buckets || [];

        if (buckets.length === 0) {
            grid.innerHTML = "<div style='grid-column: span 2; font-size: 12px; color: #999; text-align: center;'>No buckets set. Click extension icon to configure.</div>";
            return;
        }

        buckets.forEach(b => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = b.name;
            btn.onclick = () => {
                // UI Feedback
                const status = container.querySelector('#status-msg');
                status.style.display = 'block';
                status.textContent = "Moving...";
                status.style.color = "gray";

                // Send request back to background.js
                chrome.runtime.sendMessage({
                    action: "move_file_request",
                    filename: filename,
                    path: b.path
                }, (response) => {
                    if (response && response.status === "success") {
                        status.innerHTML = `✅ Moved to <b>${b.name}</b>`;
                        status.style.color = "green";
                        setTimeout(() => rootHost.remove(), 1500);
                    } else {
                        status.textContent = "Error moving file.";
                        status.style.color = "red";
                    }
                });
            };
            grid.appendChild(btn);
        });
    });
}