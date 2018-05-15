// ------------------------------------------------------------------
// constants
const jiraNumberRegex = /([a-z0-9]{2,5}-\d{1,4})/gi;
const jiraAnchorClass = 'jira-anchor';
const copyBtnClass = 'jira-copy-issue';
const dataFooterClass = 'git-enhancer-data-footer';
const updateDateClass = 'git-update-date';
const branchDataClass = 'git-branch-data';

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
        pToken: '',
      },
      ({ jiraAnchor, jiraCopy, gitBranchData, gitUpdateDate, pToken }) => {
        jiraAnchor && addJiraAnchor();
        jiraCopy && addCopyBtnPR();

        if (pToken.length && (gitBranchData || gitUpdateDate)) {
          const prUrl = 'https://api.github.com/repos/picmonkey/picmonkey/pulls';

          // Don't spam the API
          const updateDateAdded = document.getElementsByClassName(updateDateClass);
          const branchDataAdded = document.getElementsByClassName(branchDataClass);
          if (updateDateAdded.length && branchDataAdded.length) return;

          gitApiCall(prUrl, pToken, pullList => {
            createDataFooter();

            gitUpdateDate && addUpdateDate(pullList);
            gitBranchData && addBranchData(pullList);
          });
        }
      }
    );
  }
});
