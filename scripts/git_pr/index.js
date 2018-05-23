// ------------------------------------------------------------------
// script subscription
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.git_pr_content) {
    chrome.storage.sync.get(
      {
        jiraTitleLink: false,
        gitReviewsRequested: false,
        pToken: '',
      },
      function({ pToken, jiraTitleLink, gitReviewsRequested }) {
        jiraTitleLink && addJiraLink();

        // ------------------------------
        // PR review requests call
        if (pToken.length && gitReviewsRequested) {
          gitReviewsRequested && addPrReviewsRequested(pToken);
        }
      }
    );
  }
});
