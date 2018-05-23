// ------------------------------------------------------------------
// Adds anchor with number of requested reviews
function addPrReviewsRequested(pToken) {
  // Don't spam the API
  const reviewAdded = document.getElementsByClassName(reviewsPrRequestedClass);
  if (reviewAdded.length) return;

  gitApiCall(userURL, pToken, user => {
    const currentUser = user.login;
    const userReviewsURL = reviewRequestedURL.replace('$user', currentUser);
    const userReviewsAnchor = `/picmonkey/picmonkey/issues?q=is:pr+is:open+review-requested:${currentUser}`;

    gitApiCall(userReviewsURL, pToken, reviewsRequested => {
      const reviewReq = [];

      // validate review URL (that comes from picmonkey)
      reviewsRequested.items.forEach(review => {
        if (review.url.match('repos/picmonkey/picmonkey')) {
          reviewReq.push(review);
        }
      });

      const newBtn = document.createElement('a');
      newBtn.setAttribute('class', `js-selected-nativation-item subnav-item ${reviewsPrRequestedClass}`);
      newBtn.setAttribute('href', userReviewsAnchor);
      newBtn.innerHTML = `Reviews <span class="git-review-notif-nbr">${reviewReq.length}</span>`;

      const menuAnchor = document.getElementsByClassName('gh-header-actions')[0];
      menuAnchor && menuAnchor.prepend(newBtn);
    });
  });
}
