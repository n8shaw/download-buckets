// 1. Try to suppress the native download shelf/bubble
chrome.downloads.setShelfEnabled(false);

// 2. Listen for Download Finish
chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === 'complete') {
    // Inject the overlay into the current tab
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        // Find the filename
        chrome.downloads.search({id: delta.id}, (items) => {
            if (!items || !items.length) return;
            const filename = items[0].filename.split(/[/\\]/).pop();

            // Execute the overlay script, passing the filename
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ['overlay.js']
            }, () => {
              // Send the filename TO the injected script
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "init_overlay", 
                filename: filename
              });
            });
        });
      }
    });
  }
});

// 3. Middleman: Relay messages from Overlay -> Python
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "move_file_request") {
    chrome.runtime.sendNativeMessage('com.nate.bucket_sorter',
      { action: "move_file", filename: msg.filename, destination: msg.path },
      (nativeResponse) => {
        sendResponse(nativeResponse);
      }
    );
    return true; // Keep channel open for async response
  }
});