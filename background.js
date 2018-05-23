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
const prUpdate = debounce(tab => {
  chrome.tabs.sendMessage(tab.id, { git_pr_content: true });
}, 250);

const pullsUpdate = debounce(tab => {
  chrome.tabs.sendMessage(tab.id, { git_pulls: true });
}, 250);

// ------------------------------------------------------------------
// Tab listeners
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // fire when loading is done + debounce
  if (tab.url.match('https://github.com/picmonkey/picmonkey/pull/*')) {
    prUpdate(tab);
  }
  if (tab.url.match('https://github.com/picmonkey/picmonkey/pulls')) {
    pullsUpdate(tab);
  }
});
