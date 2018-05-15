// ------------------------------------------------------------------
// branch names
function addBranchData(pullList) {
  const issueList = document.getElementsByClassName('js-issue-row');

  for (let i = 0; i < issueList.length; i++) {
    const prID = issueList[i].getAttribute('id').match(/(?<=issue_).*/gi);
    const pr = pullList.find(x => x.number == prID);
    if (!pr) return;

    const branchData = document.createElement('span');
    branchData.setAttribute('class', branchDataClass);
    branchData.innerHTML = `${pr.head.ref} -> ${pr.base.ref}`;

    const anchor = document.querySelectorAll(`div.${dataFooterClass}[data-id="${pr.number}"]`)[0];
    anchor.appendChild(branchData);
  }
}
