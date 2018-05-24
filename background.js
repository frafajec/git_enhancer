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

const debounceTime = 300;
// ------------------------------------------------------------------
// PicMonkey content script notificators
const prUpdate = debounce(tabID => {
  chrome.tabs.sendMessage(tabID, { git_pr: true });
}, debounceTime);

const pullsUpdate = debounce(tabID => {
  chrome.tabs.sendMessage(tabID, { git_pulls: true });
}, debounceTime);

// ------------------------------------------------------------------
// Tab listeners
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
  // fire when loading is done + debounce
  if (tab.url.match('https://github.com/picmonkey/picmonkey/pull/*')) {
    prUpdate(tabID);
  }
  if (tab.url.match('https://github.com/picmonkey/picmonkey/pulls')) {
    pullsUpdate(tabID);
  }
});
