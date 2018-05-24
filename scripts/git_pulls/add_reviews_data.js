// ------------------------------------------------------------------
// adds review status next to PR
function addReviewsData(pToken) {
  // Don't spam the API
  const reviewAdded = document.getElementsByClassName(reviewsClass);
  if (reviewAdded.length) return;

  // ------------------------------------------------------
  //get all visible opened PRs
  const issueList = document.getElementsByClassName('js-issue-row');
  const reviewIDs = [];
  const reviewURLs = [];
  for (let i = 0; i < issueList.length; i++) {
    // what an amazing hack...
    const reviewStatus = issueList[i].querySelectorAll('.opened-by')[0].nextElementSibling.innerText;
    const merged = !!issueList[i].querySelectorAll('.merged').length;
    const closed = !!issueList[i].querySelectorAll('.closed').length;

    // only collect where there is review and is open
    if (!merged && !closed) {
      const prID = issueList[i].getAttribute('id').match(/(?<=issue_).*/gi)[0];
      reviewURLs.push(reviewURL.replace('$pr_number', prID));
      reviewIDs.push(prID);
    }
  }

  // ------------------------------------------------------
  gitApiCall(reviewURLs, pToken, res => {
    // verify still not added
    const reviewAdded = document.getElementsByClassName(reviewsClass);
    if (reviewAdded.length) return;

    // combine PRs and reviews
    const prReviews = {};
    for (let i = 0; i < reviewIDs.length; i++) {
      prReviews[reviewIDs[i]] = res[i];
    }

    // add data for each PR
    for (prID in prReviews) {
      const reviewsData = document.createElement('div');
      reviewsData.setAttribute('class', reviewsClass);

      // ------------------------------
      // uniquify reviews per user
      const reviews = uniquifyReviews(prReviews[prID].reverse());

      // ------------------------------
      // collect reviews
      const { seattleReview, psideReview } = getReviewStates(reviews);

      // ------------------------------
      // Seattle/Pside icons
      reviewsData.appendChild(createReviewIcon('seattle-review', seattleReview.reviews, seattleReview.state));
      reviewsData.appendChild(createReviewIcon('pside-review', psideReview.reviews, psideReview.state));

      // ------------------------------
      // insert in DOM
      const anchor = document.querySelectorAll(`div.${dataFooterClass}[data-id="${prID}"] .box-review`)[0];
      anchor && anchor.appendChild(reviewsData);
    }
  });
}
