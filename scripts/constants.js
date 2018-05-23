// ------------------------------------------------------------------
// constants
const jiraNumberRegex = /([a-z0-9]{2,5}-\d{1,4})/gi;

const jiraAnchorClass = 'jira-anchor';
const copyBtnClass = 'jira-copy-issue';
const dataFooterClass = 'git-enhancer-data-footer';
const dataHeaderClass = 'git-enhancer-data-header';
const updateDateClass = 'git-update-date';
const branchDataClass = 'git-branch-data';
const reviewsClass = 'git-reviews';
const reviewsPullsRequestedClass = 'git-pulls-review-request';
const reviewsPullsFilteringClass = 'git-pulls-review-filtering';
const reviewsPrRequestedClass = 'git-pr-review-request';

const userURL = 'https://api.github.com/user';
const prURL = 'https://api.github.com/repos/picmonkey/picmonkey/pulls/$pr_number';
const reviewURL = 'https://api.github.com/repos/picmonkey/picmonkey/pulls/$pr_number/reviews';
const reviewRequestedURL = 'https://api.github.com/search/issues?q=is:open+is:pr+review-requested:$user';
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