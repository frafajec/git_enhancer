// ------------------------------------------------------------------
// script subscription
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.git_pulls) {
    chrome.storage.sync.get(
      {
        jiraAnchor: false,
        jiraCopy: false,
        gitBranchData: false,
        gitUpdateDate: false,
        gitReviews: false,
        gitReviewsRequested: false,
        gitReviewsFiltering: false,
        gitReviewsChanges: false,
        pToken: '',
      },
      ({
        jiraAnchor,
        jiraCopy,
        gitBranchData,
        gitUpdateDate,
        gitReviews,
        gitReviewsRequested,
        gitReviewsFiltering,
        gitReviewsChanges,
        pToken,
      }) => {
        // ------------------------------
        // jira helpers
        jiraAnchor && addJiraAnchor();
        jiraCopy && addCopyBtnPR();

        // ------------------------------
        // add meta fields for data
        createDataHeader({ gitReviewsRequested, gitReviewsFiltering, gitReviewsChanges });
        createDataFooter({ gitBranchData, gitUpdateDate, gitReviews });

        // ------------------------------
        // All general PR calls
        if (pToken.length && (gitBranchData || gitUpdateDate)) {
          // Don't spam the API
          const updateDateAdded = document.getElementsByClassName(updateDateClass);
          const branchDataAdded = document.getElementsByClassName(branchDataClass);
          if (updateDateAdded.length && branchDataAdded.length) return;

          //get all visible PRs
          const issueList = document.getElementsByClassName('js-issue-row');
          const prURLs = [];
          for (let i = 0; i < issueList.length; i++) {
            const prID = issueList[i].getAttribute('id').match(/(?<=issue_).*/gi)[0];
            prURLs.push(prURL.replace('$pr_number', prID));
          }

          gitApiCall(prURLs, pToken, pullList => {
            gitUpdateDate && addUpdateDate(pullList);
            gitBranchData && addBranchData(pullList);
          });
        }

        // ------------------------------
        // PR review calls
        if (pToken.length && gitReviews) {
          gitReviews && addReviewsData(pToken);
        }

        // ------------------------------
        // PR review requests call
        if (pToken.length && gitReviewsRequested) {
          gitReviewsRequested && addPullsReviewsRequested(pToken);
        }

        // ------------------------------
        // Review filtering
        if (pToken.length && gitReviewsFiltering) {
          gitReviewsFiltering && addReviewsFiltering(pToken);
        }

        // ------------------------------
        // Review changes on own PRs
        if (pToken.length && gitReviewsFiltering) {
          gitReviewsChanges && addChangesRequested(pToken);
        }
      }
    );
  }
});
