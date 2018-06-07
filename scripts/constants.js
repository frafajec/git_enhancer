// ------------------------------------------------------------------
// constants
const jiraNumberRegex = /([a-z0-9]{2,5}-\d{1,4})/gi;
const repoRegex = /repos\/picmonkey\/(.*?)\//;
const locationRepoRegex = /github.com\/picmonkey\/(.*?)\//;

const jiraAnchorClass = 'jira-anchor';
const copyBtnClass = 'jira-copy-issue';
const dataFooterClass = 'git-enhancer-data-footer';
const dataHeaderClass = 'git-enhancer-data-header';
const updateDateClass = 'git-update-date';
const branchDataClass = 'git-branch-data';
const reviewsClass = 'git-reviews';
const reviewsPullsFilteringClass = 'git-pulls-review-filtering';
const reviewsPullsChangesRequested = 'git-pulls-review-changes';
const reviewsPullsRequestedClass = 'git-pulls-review-request';
const reviewsPrRequestedClass = 'git-pr-review-request';
const reviewsPrChangesRequested = 'git-pr-review-changes';

const userURL = 'https://api.github.com/user';
const reviewRequestedURL = 'https://api.github.com/search/issues?q=is:open+is:pr+review-requested:$user';
const reviewChangesURL = 'https://api.github.com/search/issues?q=is:open+is:pr+review:changes-requested+author:$user';
const filesURL = 'https://api.github.com/repos/picmonkey/picmonkey/pulls/$pr_number/files?page=$page';
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

const REVIEW_STATE = {
  APPROVED: 'APPROVED',
  REJECTED: 'CHANGES_REQUESTED',
  PENDING: 'PENDING',
  COMMENTED: 'COMMENTED',
  DISMISSED: 'DISMISSED',
};

const REVIEW_ICON = {
  [REVIEW_STATE.APPROVED]: chrome.extension.getURL('assets/approved.png'),
  [REVIEW_STATE.PENDING]: chrome.extension.getURL('assets/pending.png'),
  [REVIEW_STATE.REJECTED]: chrome.extension.getURL('assets/rejected.png'),
  [REVIEW_STATE.COMMENTED]: chrome.extension.getURL('assets/comment.png'),
  [REVIEW_STATE.DISMISSED]: chrome.extension.getURL('assets/dismissed.png'),
};

const copyIconSrc = chrome.extension.getURL('assets/copy.png');
const jiraIconSrc = chrome.extension.getURL('assets/jira-icon.png');
