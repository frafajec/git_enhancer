function insertAnchor(anchor, title) {
  if (!title) return null;

  let jiraAnchor;
  for (let i = 0; i < title.length; i++) {
    jiraAnchor = document.createElement('a');
    jiraAnchor.setAttribute('href', `https://picmonkey.atlassian.net/browse/${title[i]}`);
    jiraAnchor.setAttribute('target', '_blank');
    jiraAnchor.setAttribute('class', 'jira-link-title');
    jiraAnchor.innerHTML = `[${title[i]}]`;

    anchor.parentNode.insertBefore(jiraAnchor, anchor);
  }
}

function addJiraAnchor() {
  const issueList = document.getElementsByClassName('js-issue-row');
  const replaced = document.getElementsByClassName('jira-link-title');

  if (replaced.length === 0) {
    for (let i = 0; i < issueList.length; i++) {
      const jiraTitle = issueList[i].querySelectorAll('.js-navigation-open')[0];
      // could be multiple issues
      const jiraNumber = jiraTitle.innerHTML.match(/([a-z0-9]{2,5}-\d{1,4})/gi);

      insertAnchor(jiraTitle, jiraNumber);
    }
  }
}

// actual script run
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.git_pulls) {
    addJiraAnchor();
  }
});
