// Saves options to chrome.storage
function save_options() {
  // options
  const pToken = document.getElementById('personal-token').value;
  const jiraTitleLink = document.getElementById('jira-title-link').checked;
  const jiraAnchor = document.getElementById('jira-anchor').checked;
  const gitBranchData = document.getElementById('git-branch-data').checked;
  const gitUpdateDate = document.getElementById('git-update-date').checked;
  const gitReviews = document.getElementById('git-reviews').checked;
  const jiraCopy = document.getElementById('jira-copy-issue').checked;

  chrome.storage.sync.set(
    {
      pToken,
      jiraTitleLink,
      jiraAnchor,
      jiraCopy,
      gitBranchData,
      gitUpdateDate,
      gitReviews,
    },
    function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    }
  );
}

// Restores UI from storage
function restore_options() {
  chrome.storage.sync.get(
    {
      pToken: '',
      jiraTitleLink: false,
      jiraAnchor: false,
      gitBranchData: false,
      gitUpdateDate: false,
      gitReviews: false,
      jiraCopy: false,
    },
    function(items) {
      document.getElementById('personal-token').value = items.pToken;
      document.getElementById('jira-title-link').checked = items.jiraTitleLink;
      document.getElementById('jira-anchor').checked = items.jiraAnchor;
      document.getElementById('git-branch-data').checked = items.gitBranchData;
      document.getElementById('git-update-date').checked = items.gitUpdateDate;
      document.getElementById('git-reviews').checked = items.gitReviews;
      document.getElementById('jira-copy-issue').checked = items.jiraCopy;
    }
  );
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
