// ------------------------------------------------------------------
// Adds anchor with number of requested reviews
function addPullsReviewsRequested(pToken) {
  // Don't spam the API
  const reviewAdded = document.getElementsByClassName(reviewsPullsRequestedClass);
  if (reviewAdded.length) return;

  gitApiCall(userURL, pToken, user => {
    const currentUser = user.login;
    const userReviewsURL = reviewRequestedURL.replace('$user', currentUser);

    gitApiCall(userReviewsURL, pToken, reviewsRequested => {
      const reviewReq = [];

      // verify not yet added
      const reviewAdded = document.getElementsByClassName(reviewsPullsRequestedClass);
      if (reviewAdded.length) return;

      // validate review URL (that comes from picmonkey)
      reviewsRequested.items.forEach(review => {
        if (review.url.match('repos/picmonkey')) {
          reviewReq.push(review);
        }
      });

      const newBtn = document.createElement('a');
      newBtn.setAttribute('class', `js-selected-nativation-item subnav-item ${reviewsPullsRequestedClass}`);
      newBtn.setAttribute('href', getReviewRequestedURL(currentUser, reviewReq));
      newBtn.innerHTML =
        'Reviews ' + (reviewReq.length ? `<span class="git-review-notif-nbr">${reviewReq.length}</span>` : '');

      // insert into dom
      const headerAnchor = document.querySelectorAll(`.${dataHeaderClass} .box-requested`)[0];
      headerAnchor && headerAnchor.prepend(newBtn);
    });
  });
}
