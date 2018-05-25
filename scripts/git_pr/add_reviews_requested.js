// ------------------------------------------------------------------
// Adds anchor with number of requested reviews
function addPrReviewsRequested(pToken) {
  // Don't spam the API
  const reviewAdded = document.getElementsByClassName(reviewsPrRequestedClass);
  if (reviewAdded.length) return;

  // call to get current user
  gitApiCall(userURL, pToken, user => {
    const currentUser = user.login;
    const userReviewsURL = reviewRequestedURL.replace('$user', currentUser);

    // collect all review requests for current user
    gitApiCall(userReviewsURL, pToken, reviewsRequested => {
      const reviewReq = [];

      // prevent double adding
      const reviewAdded = document.getElementsByClassName(reviewsPrRequestedClass);
      if (reviewAdded.length) return;

      // validate review URL (that comes from picmonkey)
      reviewsRequested.items.forEach(review => {
        if (review.url.match('repos/picmonkey/picmonkey')) {
          reviewReq.push(review);
        }
      });

      // create review button
      const newBtn = document.createElement('a');
      newBtn.setAttribute('class', `js-selected-nativation-item subnav-item ${reviewsPrRequestedClass}`);
      newBtn.setAttribute('href', getReviewRequestedURL(currentUser, reviewReq));
      newBtn.innerHTML = `Reviews <span class="git-review-notif-nbr">${reviewReq.length}</span>`;

      // add to DOM
      const menuAnchor = document.getElementsByClassName('gh-header-actions')[0];
      menuAnchor && menuAnchor.prepend(newBtn);
    });
  });
}
