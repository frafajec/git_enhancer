// ------------------------------------------------------------------
// branch names
function addBranchData(pullList) {
  const issueList = document.getElementsByClassName('js-issue-row');

  for (let i = 0; i < issueList.length; i++) {
    const prID = issueList[i].getAttribute('id').match(/(?<=issue_).*/gi)[0];
    const pr = pullList.find(x => x.number == prID);
    if (!pr) continue;

    const branchData = document.createElement('span');
    branchData.setAttribute('class', branchDataClass);
    branchData.innerHTML = `${pr.head.ref} -> ${pr.base.ref}`;

    const anchor = document.querySelectorAll(`div.${dataFooterClass}[data-id="${pr.number}"] .box-branch`)[0];
    anchor.appendChild(branchData);
  }
}
