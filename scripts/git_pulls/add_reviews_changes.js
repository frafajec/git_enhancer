// ------------------------------------------------------------------
// Adds anchor with number of requested reviews
function addChangesRequested(pToken) {
  // Don't spam the API
  const reviewAdded = document.getElementsByClassName(reviewsPullsChangesRequested);
  if (reviewAdded.length) return;

  gitApiCall(userURL, pToken, user => {
    const currentUser = user.login;
    const userReviewsURL = reviewChangesURL.replace('$user', currentUser);

    gitApiCall(userReviewsURL, pToken, reviewsRequested => {
      const reviewReq = [];

      // verify not yet added
      const reviewAdded = document.getElementsByClassName(reviewsPullsChangesRequested);
      if (reviewAdded.length) return;

      // validate review URL (that comes from picmonkey)
      reviewsRequested.items.forEach(review => {
        if (review.url.match('repos/picmonkey/picmonkey')) {
          reviewReq.push(review);
        }
      });

      const newBtn = document.createElement('a');
      newBtn.setAttribute('class', `js-selected-nativation-item subnav-item ${reviewsPullsChangesRequested}`);
      newBtn.setAttribute('href', getReviewChangesURL(currentUser, reviewReq));
      newBtn.innerHTML =
        'Changes req. ' + (reviewReq.length ? `<span class="git-review-notif-nbr">${reviewReq.length}</span>` : '');

      // insert into dom
      const headerAnchor = document.querySelectorAll(`.${dataHeaderClass} .box-changes`)[0];
      headerAnchor && headerAnchor.append(newBtn);
    });
  });
}
