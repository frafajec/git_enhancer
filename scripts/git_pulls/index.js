// ------------------------------------------------------------------
// constants
const jiraNumberRegex = /([a-z0-9]{2,5}-\d{1,4})/gi;
const jiraAnchorClass = 'jira-anchor';
const copyBtnClass = 'jira-copy-issue';
const dataFooterClass = 'git-enhancer-data-footer';
const updateDateClass = 'git-update-date';
const branchDataClass = 'git-branch-data';
const reviewsClass = 'git-reviews';
const prURL = 'https://api.github.com/repos/picmonkey/picmonkey/pulls/$pr_number';
const reviewURL = 'https://api.github.com/repos/picmonkey/picmonkey/pulls/$pr_number/reviews';
const seattleUsers = [
  'pkenway',
  'pconerly',
  'planetcohen',
  'bvandenbos',
  'quasor',
  'freya301',
  'danarrington',
  'ebrine',
  'petercgrant',
  'aparpar',
  'jrhie',
  'claudiecheng',
  'danielle-j',
  'picHeidi',
  'scandeezy',
  'TNorth22',
];

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
        pToken: '',
      },
      ({ jiraAnchor, jiraCopy, gitBranchData, gitUpdateDate, gitReviews, pToken }) => {
        jiraAnchor && addJiraAnchor();
        jiraCopy && addCopyBtnPR();

        // always add footer (its invisible unless filled)
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
          // Don't spam the API
          const reviewAdded = document.getElementsByClassName(reviewsClass);
          if (reviewAdded.length) return;

          gitReviews && addReviewsData(pToken);
        }
      }
    );
  }
});
