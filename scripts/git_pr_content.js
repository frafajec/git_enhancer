function replaceJiraLink() {
  const issueTitle = document.getElementsByClassName('js-issue-title');
  const jiraTitle = document.getElementsByClassName('jira-link-title');

  if (issueTitle.length > 0 && jiraTitle.length === 0) {
    const replace =
      '<a href="https://picmonkey.atlassian.net/browse/$1" target="_blank" class="jira-link-title">$1</a>';

    issueTitle[0].innerHTML = issueTitle[0].innerHTML.replace(/([a-z0-9]{2,5}-\d{1,4})/gi, replace);
  }
}

// actual script run
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.git_pr_content) {
    replaceJiraLink();
  }
});
