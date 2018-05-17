chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // fire when loading is done
  if (changeInfo.status === 'complete') {
    // match specific PR
    if (tab.url.match('https://github.com/picmonkey/picmonkey/pull/*')) {
      chrome.tabs.sendMessage(tab.id, { git_pr_content: true });
    }
    if (tab.url.match('https://github.com/picmonkey/picmonkey/pulls')) {
      chrome.tabs.sendMessage(tab.id, { git_pulls: true });
    }
  }
});
