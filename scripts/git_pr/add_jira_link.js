// ------------------------------------------------------------------
// reads title and adds anchor to jira
function addJiraLink() {
  const issueTitle = document.getElementsByClassName('js-issue-title');
  const jiraTitle = document.getElementsByClassName('jira-title-link');

  if (issueTitle.length > 0 && jiraTitle.length === 0) {
    const replace =
      '<a href="https://picmonkey.atlassian.net/browse/$1" target="_blank" class="jira-title-link">$1</a>';

    issueTitle[0].innerHTML = issueTitle[0].innerHTML.replace(/([a-z0-9]{2,5}-\d{1,4})/gi, replace);
  }
}
