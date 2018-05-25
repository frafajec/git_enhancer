// ------------------------------------------------------------------
// branch names
function addUpdateDate(pullList) {
  const alreadyAdded = document.getElementsByClassName(updateDateClass);
  if (alreadyAdded.length) return;

  const issueList = document.getElementsByClassName('js-issue-row');
  for (let i = 0; i < issueList.length; i++) {
    const prID = issueList[i].getAttribute('id').match(/(?<=issue_).*/gi)[0];
    const pr = pullList.find(x => x.number == prID);
    if (!pr) continue;

    const updatedDiff = (new Date().getTime() - new Date(pr.updated_at).getTime()) / (1000 * 3600);
    const updatedDays = Math.round(updatedDiff / 24);

    let lastUpdated = '';
    if (updatedDiff / 24 < 1) {
      const hoursAgo = Math.round(updatedDiff);
      if (hoursAgo < 1) lastUpdated = '<1 hour ago';
      else if (hoursAgo === 1) lastUpdated = '1 hour ago';
      else lastUpdated = `${hoursAgo} hours ago`;
    } else if (updatedDays === 1) {
      lastUpdated = '1 day ago';
    } else {
      lastUpdated = `${updatedDays} days ago`;
    }

    const updateDate = document.createElement('span');
    updateDate.setAttribute('class', updateDateClass);
    updateDate.innerHTML = `Updated <strong>${lastUpdated}</strong>`;

    const anchor = document.querySelectorAll(`div.${dataFooterClass}[data-id="${pr.number}"] .box-date`)[0];
    anchor.appendChild(updateDate);
  }
}
