// ------------------------------------------------------------------
// adds Jira issue link next to PR
function addJiraAnchor() {
  function insertAnchor(anchor, title) {
    if (!title) return null;

    let jiraAnchor;
    for (let i = 0; i < title.length; i++) {
      jiraAnchor = document.createElement('a');
      jiraAnchor.setAttribute('href', `https://picmonkey.atlassian.net/browse/${title[i]}`);
      jiraAnchor.setAttribute('target', '_blank');
      jiraAnchor.setAttribute('class', jiraAnchorClass);

      const jiraIcon = document.createElement('img');
      jiraIcon.setAttribute('src', jiraIconSrc);
      jiraAnchor.appendChild(jiraIcon);

      anchor.parentNode.insertBefore(jiraAnchor, anchor);
    }
  }

  const alreadyAdded = document.getElementsByClassName(jiraAnchorClass);
  if (alreadyAdded.length === 0) {
    const issueList = document.getElementsByClassName('js-issue-row');

    for (let i = 0; i < issueList.length; i++) {
      const jiraTitle = issueList[i].querySelectorAll('.js-navigation-open')[0];
      // could be multiple issues
      const jiraNumber = jiraTitle.innerHTML.match(jiraNumberRegex);

      insertAnchor(jiraTitle, jiraNumber);
    }
  }
}
