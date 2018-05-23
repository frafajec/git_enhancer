// ------------------------------
// create individual user review icon
function createUserReviewImg(state) {
  return `<img class="review-image" src="${REVIEW_ICON[state]}">`;
}

// ------------------------------
// create seattle/pside review state icon
function createReviewIcon(cls, tooltipData, state) {
  const wrapper = document.createElement('span');
  wrapper.setAttribute('class', cls);

  const tooltip = tooltipData.length ? `<span>${tooltipData.join('\n')}</span>` : '';
  const img = `<img class="merge-state" src="${REVIEW_ICON[state]}">`;

  wrapper.innerHTML = tooltip + img;
  return wrapper;
}

// ------------------------------
// collect reviews and group by newest review from single dev
function uniquifyReviews(arr, key) {
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
}

// ------------------------------
// collect reviews and reason
function getReviewStates(reviews) {
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
}
