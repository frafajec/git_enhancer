// ------------------------------------------------------------------
// script subscription
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.git_pr_content) {
    chrome.storage.sync.get(
      {
        jiraTitleLink: false,
      },
      function({ jiraTitleLink }) {
        jiraTitleLink && addJiraLink();
      }
    );
  }
});
