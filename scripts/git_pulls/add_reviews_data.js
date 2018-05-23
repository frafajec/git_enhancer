const REVIEW_STATE = {
  APPROVED: 'APPROVED',
  REJECTED: 'CHANGES_REQUESTED',
  PENDING: 'PENDING',
  COMMENTED: 'COMMENTED',
  DISMISSED: 'DISMISSED',
};

const REVIEW_ICON = {
  [REVIEW_STATE.APPROVED]: chrome.extension.getURL('assets/approved.png'),
  [REVIEW_STATE.PENDING]: chrome.extension.getURL('assets/pending.png'),
  [REVIEW_STATE.REJECTED]: chrome.extension.getURL('assets/rejected.png'),
  [REVIEW_STATE.COMMENTED]: chrome.extension.getURL('assets/comment.png'),
  [REVIEW_STATE.DISMISSED]: chrome.extension.getURL('assets/dismissed.png'),
};

// ------------------------------------------------------------------
// adds review status next to PR
function addReviewsData(pToken) {
  // Don't spam the API
  const reviewAdded = document.getElementsByClassName(reviewsClass);
  if (reviewAdded.length) return;

  // create individual user review icon
  const createUserReviewImg = state => {
    return `<img class="review-image" src="${REVIEW_ICON[state]}">`;
  };

  // create seattle/pside review state icon
  const createReviewIcon = (cls, tooltipData, state) => {
    const wrapper = document.createElement('span');
    wrapper.setAttribute('class', cls);

    const tooltip = tooltipData.length ? `<span>${tooltipData.join('\n')}</span>` : '';
    const img = `<img class="merge-state" src="${REVIEW_ICON[state]}">`;

    wrapper.innerHTML = tooltip + img;
    return wrapper;
  };

  // ------------------------------
  // collect reviews and reason
  const getReviewStates = reviews => {
    const reviewsSeattle = [];
    let reviewSeattleState = REVIEW_STATE.PENDING;
    let reviewSeattleHasApproved = false;
    let reviewSeattleHasRejected = false;
    const reviewsPside = [];
    let reviewPsideState = REVIEW_STATE.PENDING;
    let reviewPsideHasApproved = false;
    let reviewPsideHasRejected = false;

    // Extract user/review
    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      const reviewState = review.state;
      const reviewUser = review.user.login;

      if (seattleUsers.indexOf(reviewUser) !== -1) {
        if (reviewState === REVIEW_STATE.APPROVED) reviewSeattleHasApproved = true;
        if (reviewState === REVIEW_STATE.REJECTED) reviewSeattleHasRejected = true;

        reviewsSeattle.push(`${reviewUser} ${createUserReviewImg(reviewState)}`);
      } else {
        if (reviewState === REVIEW_STATE.APPROVED) reviewPsideHasApproved = true;
        if (reviewState === REVIEW_STATE.REJECTED) reviewPsideHasRejected = true;

        reviewsPside.push(`${reviewUser} ${createUserReviewImg(reviewState)}`);
      }
    }

    // set pr state overall
    if (reviewSeattleHasApproved) reviewSeattleState = REVIEW_STATE.APPROVED;
    if (reviewSeattleHasRejected) reviewSeattleState = REVIEW_STATE.REJECTED;
    if (reviewPsideHasApproved) reviewPsideState = REVIEW_STATE.APPROVED;
    if (reviewPsideHasRejected) reviewPsideState = REVIEW_STATE.REJECTED;

    return {
      seattleReview: { reviews: reviewsSeattle, state: reviewSeattleState },
      psideReview: { reviews: reviewsPside, state: reviewPsideState },
    };
  };

  const uniquifyReviews = (arr, key) => {
    const unique = [];
    const found = {};

    arr.forEach(obj => {
      var value = obj.user.id;
      if (!found[value]) {
        found[value] = true;
        unique.push(obj);
      }
    });

    return unique;
  };

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
      anchor.appendChild(reviewsData);
    }
  });
}
