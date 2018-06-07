// ------------------------------------------------------------------
// script subscription
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.git_pr) {
    chrome.storage.sync.get(
      {
        jiraTitleLink: false,
        gitReviewsRequested: false,
        gitReviewsChanges: false,
        gitFileStats: false,
        pToken: '',
      },
      function({ pToken, jiraTitleLink, gitReviewsRequested, gitReviewsChanges, gitFileStats }) {
        jiraTitleLink && addJiraLink();

        // ------------------------------
        // PR review requests call
        if (pToken.length && gitReviewsRequested) {
          addPrReviewsRequested(pToken);
        }

        // ------------------------------
        // PR review changes call
        if (pToken.length && gitReviewsChanges) {
          addPrChangesRequested(pToken);
        }

        if (pToken.length && gitFileStats) {
          addCodeStats(pToken);
        }
      }
    );
  }
});
