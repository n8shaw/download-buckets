'use strict';

/**
 * Download Buckets - Download Overlay
 * Displays sorting UI when downloads complete.
 */

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'init_overlay') {
    createOverlay(request.filename);
  }
});

function createOverlay(filename) {
  const existing = document.getElementById('bucket-sorter-root');
  if (existing) existing.remove();

  const root = document.createElement('div');
  root.id = 'bucket-sorter-root';
  const shadow = root.attachShadow({ mode: 'open' });
  document.body.appendChild(root);

  shadow.innerHTML = `
    <style>
      .container {
        position: fixed; bottom: 20px; right: 20px; width: 320px;
        background: #fff; border-radius: 16px; padding: 20px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        z-index: 2147483647; border: 1px solid rgba(0,0,0,0.08);
        animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
      .icon {
        width: 40px; height: 40px; background: #e8f0fe; border-radius: 12px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .icon svg { width: 24px; height: 24px; fill: #1967d2; }
      .title-group { overflow: hidden; }
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
      .btn:hover { background: #f1f3f4; transform: translateY(-1px); }
      .btn-primary {
        background: #1967d2; border-color: #1967d2; color: #fff;
      }
      .btn-primary:hover { background: #1557b0; }
      .btn-custom {
        grid-column: span 2; background: #f8f9fa;
        border: 1px dashed #dadce0; color: #5f6368;
      }
      .btn-custom:hover { background: #e8f0fe; border-color: #1967d2; border-style: solid; color: #1967d2; }
      .close { position: absolute; top: 12px; right: 12px; border: none; background: none; color: #dadce0; font-size: 20px; cursor: pointer; padding: 4px; }
      .close:hover { color: #5f6368; }
      .status { margin-top: 12px; text-align: center; font-size: 12px; display: none; }
    </style>
    <div class="container">
      <button class="close">×</button>
      <div class="header">
        <div class="icon"><svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg></div>
        <div class="title-group">
          <div class="filename">${filename}</div>
          <div class="subtitle">Download complete</div>
        </div>
      </div>
      <div class="grid"></div>
      <div class="status"></div>
    </div>
  `;

  const container = shadow.querySelector('.container');
  const grid = shadow.querySelector('.grid');
  const status = shadow.querySelector('.status');
  const subtitle = shadow.querySelector('.subtitle');

  shadow.querySelector('.close').onclick = () => root.remove();

  // Show initial Open vs Sort choice
  showInitialChoice();

  function showInitialChoice() {
    grid.innerHTML = '';

    const openBtn = document.createElement('button');
    openBtn.className = 'btn btn-primary';
    openBtn.textContent = '📂 Open';
    openBtn.onclick = () => openFile(filename);
    grid.appendChild(openBtn);

    const sortBtn = document.createElement('button');
    sortBtn.className = 'btn';
    sortBtn.textContent = '🗂️ Sort';
    sortBtn.onclick = () => showSortUI();
    grid.appendChild(sortBtn);
  }

  function openFile(file) {
    showStatus('Opening...', '#5f6368');
    chrome.runtime.sendMessage({ action: 'open_file_request', filename: file }, (response) => {
      if (response?.status === 'success') {
        root.remove();
      } else {
        showStatus('Error opening file', '#d93025');
      }
    });
  }

  function showSortUI() {
    subtitle.textContent = 'Sort this download';
    grid.innerHTML = '';

    chrome.storage.local.get(['buckets'], (res) => {
      const buckets = res.buckets || [];

      if (!buckets.length) {
        grid.innerHTML = '<div style="grid-column:span 2;font-size:12px;color:#999;text-align:center">No buckets configured</div>';
      }

      buckets.forEach((bucket) => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = bucket.name;
        btn.onclick = () => moveFile(filename, bucket.path, bucket.name);
        grid.appendChild(btn);
      });

      const customBtn = document.createElement('button');
      customBtn.className = 'btn btn-custom';
      customBtn.textContent = '📁 Choose Location...';
      customBtn.onclick = () => pickAndMove(filename);
      grid.appendChild(customBtn);
    });
  }

  function moveFile(file, path, name) {
    showStatus('Moving...', '#5f6368');
    chrome.runtime.sendMessage({ action: 'move_file_request', filename: file, path }, (response) => {
      handleResponse(response, name);
    });
  }

  function pickAndMove(file) {
    showStatus('Opening picker...', '#5f6368');
    chrome.runtime.sendMessage({ action: 'pick_and_move_request', filename: file }, (response) => {
      if (response?.status === 'cancelled') {
        status.style.display = 'none';
      } else {
        const name = response?.path?.split(/[/\\]/).pop() || 'folder';
        handleResponse(response, name);
      }
    });
  }

  function handleResponse(response, name) {
    if (response?.status === 'success') {
      showStatus(`✅ Moved to <b>${name}</b>`, '#188038');
      setTimeout(() => root.remove(), 1500);
    } else {
      showStatus('Error moving file', '#d93025');
    }
  }

  function showStatus(msg, color) {
    status.style.display = 'block';
    status.innerHTML = msg;
    status.style.color = color;
  }
}