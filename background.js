// ------------------------------------------------------------------
// Helper functions
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// ------------------------------------------------------------------
// PicMonkey content script notificators
const prUpdate = tab => {
  chrome.tabs.sendMessage(tab.id, { git_pr_content: true });
};

const pullsUpdate = tab => {
  chrome.tabs.sendMessage(tab.id, { git_pulls: true });
};

// ------------------------------------------------------------------
// Tab listeners
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // fire when loading is done + debounce
  console.log(changeInfo, tab);
  if (changeInfo.status === 'complete') {
    // match specific PR
    if (tab.url.match('https://github.com/picmonkey/picmonkey/pull/*')) {
      // chrome.tabs.sendMessage(tab.id, { git_pr_content: true });
      prUpdate(tab);
    }
    if (tab.url.match('https://github.com/picmonkey/picmonkey/pulls')) {
      // chrome.tabs.sendMessage(tab.id, { git_pulls: true });
      pullsUpdate(tab);
    }
  }
});
