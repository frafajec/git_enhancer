// ------------------------------------------------------------------
// used as a placeholder for data poll
function createDataFooter({ gitBranchData, gitUpdateDate, gitReviews }) {
  const issueList = document.getElementsByClassName('js-issue-row');

  for (let i = 0; i < issueList.length; i++) {
    const prID = issueList[i].getAttribute('id').match(/(?<=issue_).*/gi);
    const anchor = issueList[i].querySelectorAll('.opened-by')[0].parentNode.parentNode; // main issue container

    const container = document.createElement('div');
    container.setAttribute('data-id', prID);
    container.setAttribute('class', `${dataFooterClass} mt-1 text-small text-gray`);

    const boxUpdate = gitUpdateDate ? `<div class="box-date"></div>` : '';
    const boxBranch = gitBranchData ? `<div class="box-branch"></div>` : '';
    const boxReview = gitReviews ? `<div class="box-review"></div>` : '';
    container.innerHTML = boxUpdate + boxBranch + boxReview;

    anchor.appendChild(container);
  }
}
