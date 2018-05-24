// ------------------------------------------------------------------
// script subscription
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.git_pr) {
    chrome.storage.sync.get(
      {
        jiraTitleLink: false,
        gitReviewsRequested: false,
        gitReviewsChanges: false,
        pToken: '',
      },
      function({ pToken, jiraTitleLink, gitReviewsRequested, gitReviewsChanges }) {
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
      }
    );
  }
});
