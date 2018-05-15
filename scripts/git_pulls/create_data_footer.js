// ------------------------------------------------------------------
// used as a placeholder for data poll
function createDataFooter() {
  const issueList = document.getElementsByClassName('js-issue-row');

  for (let i = 0; i < issueList.length; i++) {
    const prID = issueList[i].getAttribute('id').match(/(?<=issue_).*/gi);
    const anchor = issueList[i].querySelectorAll('.opened-by')[0].parentNode.parentNode; // main issue container

    const container = document.createElement('div');
    container.setAttribute('data-id', prID);
    container.setAttribute('class', `${dataFooterClass} mt-1 text-small text-gray`);
    anchor.appendChild(container);
  }
}
