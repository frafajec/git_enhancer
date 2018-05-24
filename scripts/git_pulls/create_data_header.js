// ------------------------------------------------------------------
// used as a placeholder for data poll
function createDataHeader({ gitReviewsRequested, gitReviewsFiltering, gitReviewsChanges }) {
  const headerAdded = document.getElementsByClassName(dataHeaderClass);
  if (headerAdded.length) return;

  const header = document.createElement('div');
  header.setAttribute('class', dataHeaderClass);
  header.innerHTML = `<div class="subnav-links float-left"></div>`;

  const anchor = document.querySelectorAll('.issues-listing .subnav')[0];
  anchor && anchor.appendChild(header);
}
