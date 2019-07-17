// ------------------------------------------------------------------
// used as a placeholder for data poll
function createDataHeader({ gitReviewsRequested, gitReviewsFiltering, gitReviewsChanges }) {
  const headerAdded = document.getElementsByClassName(dataHeaderClass);
  if (headerAdded.length) return;

  const header = document.createElement('div');
  header.setAttribute('class', dataHeaderClass);
  // header.innerHTML = `<div class="subnav-links float-left"></div>`;

  const boxRequested = gitReviewsRequested ? `<div class="box-requested subnav-links float-left"></div>` : '';
  const boxFiltering = gitReviewsFiltering ? `<div class="box-filtering subnav-links float-left"></div>` : '';
  const boxChanges = gitReviewsChanges ? `<div class="box-changes subnav-links float-left"></div>` : '';
  header.innerHTML = boxRequested + boxChanges + boxFiltering;

  const anchor = document.querySelectorAll('.subnav')[0];
  anchor && anchor.appendChild(header);
}
