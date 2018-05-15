// ------------------------------------------------------------------
// branch names
function addUpdateDate(pullList) {
  const issueList = document.getElementsByClassName('js-issue-row');

  for (let i = 0; i < issueList.length; i++) {
    const prID = issueList[i].getAttribute('id').match(/(?<=issue_).*/gi);
    const pr = pullList.find(x => x.number == prID);
    if (!pr) return;

    const updatedDiff = (new Date().getTime() - new Date(pr.updated_at).getTime()) / (1000 * 3600 * 24);
    const lastUpdated = updatedDiff < 1 ? '<1 day ago' : Math.round(updatedDiff) + ' day(s) ago';
    const updateDate = document.createElement('span');
    updateDate.setAttribute('class', updateDateClass);
    updateDate.innerHTML = `Updated ${lastUpdated}`;

    const anchor = document.querySelectorAll(`div.${dataFooterClass}[data-id="${pr.number}"]`)[0];
    anchor.appendChild(updateDate);
  }
}
