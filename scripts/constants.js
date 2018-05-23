// ------------------------------------------------------------------
// constants
const jiraNumberRegex = /([a-z0-9]{2,5}-\d{1,4})/gi;

const jiraAnchorClass = 'jira-anchor';
const copyBtnClass = 'jira-copy-issue';
const dataFooterClass = 'git-enhancer-data-footer';
const updateDateClass = 'git-update-date';
const branchDataClass = 'git-branch-data';
const reviewsClass = 'git-reviews';
const reviewsPullsRequestedClass = 'git-pulls-review-request';
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
