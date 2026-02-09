'use strict';

/**
 * Download Buckets - Service Worker
 * Handles download events and message routing.
 */

const NATIVE_HOST = 'com.nate.bucket_sorter';

chrome.downloads.setShelfEnabled(false);

chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state?.current !== 'complete') return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (!tabId) return;

    chrome.downloads.search({ id: delta.id }, (items) => {
      if (!items?.length) return;

      const filename = items[0].filename.split(/[/\\]/).pop();

      chrome.scripting.executeScript({
        target: { tabId },
        files: ['overlay.js']
      }, () => {
        chrome.tabs.sendMessage(tabId, {
          action: 'init_overlay',
          filename
        });
      });
    });
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'open_file_request') {
    chrome.runtime.sendNativeMessage(NATIVE_HOST, {
      action: 'open_file',
      filename: msg.filename
    }, sendResponse);
    return true;
  }

  if (msg.action === 'move_file_request') {
    chrome.runtime.sendNativeMessage(NATIVE_HOST, {
      action: 'move_file',
      filename: msg.filename,
      destination: msg.path
    }, sendResponse);
    return true;
  }

  if (msg.action === 'pick_and_move_request') {
    chrome.runtime.sendNativeMessage(NATIVE_HOST, {
      action: 'pick_and_move',
      filename: msg.filename
    }, sendResponse);
    return true;
  }
});