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

// ------------------------------
// generate URL for PR review overview
function getReviewRequestedURL(user, reviews = []) {
  let url = '';

  // go through repos and see if there is reviews from multiple repos
  const repos = {};
  for (i in reviews) {
    const match = reviews[i].url.match(repoRegex);
    if (match.length >= 2 && !repos[match[1]]) repos[match[1]] = true;
  }

  // handle URL assigning
  if (Object.keys(repos).length === 0) {
    const repo = window.location.href.match(locationRepoRegex);
    url =
      repo.length > 1
        ? `/picmonkey/${repo[1]}/issues?q=is:pr+is:open+review-requested:${user}`
        : `/picmonkey/picmonkey/issues?q=is:pr+is:open+review-requested:${user}`;
  } else if (Object.keys(repos).length === 1) {
    const repo = Object.keys(repos)[0];
    url = `/picmonkey/${repo}/issues?q=is:pr+is:open+review-requested:${user}`;
  } else {
    // redirect to user PR overall
    url = `/pulls?q=is:open+is:pr+user:picmonkey+review-requested:${user}`;
  }

  return url;
}

// ------------------------------
// generate URL for PR review overview
function getReviewChangesURL(user, reviews = []) {
  let url = '';

  // go through repos and see if there is reviews from multiple repos
  const repos = {};
  for (i in reviews) {
    const match = reviews[i].url.match(repoRegex);
    if (match.length >= 2 && !repos[match[1]]) repos[match[1]] = true;
  }

  // handle URL assigning
  if (Object.keys(repos).length === 0) {
    const repo = window.location.href.match(locationRepoRegex);
    url =
      repo.length > 1
        ? `/picmonkey/${repo[1]}/issues?q=is:pr+is:open+author:${user}+review:changes-requested`
        : `/picmonkey/picmonkey/issues?q=is:pr+is:open+author:${user}+review:changes-requested`;
  } else if (Object.keys(repos).length === 1) {
    const repo = Object.keys(repos)[0];
    url = `/picmonkey/${repo}/issues?q=is:pr+is:open+author:${user}+review:changes-requested`;
  } else {
    // redirect to user PR overall
    url = `/pulls?q=is:open+is:pr+user:picmonkey+author:${user}+review:changes-requested`;
  }

  return url;
}

// ------------------------------
// 'https://api.github.com/repos/picmonkey/picmonkey/pulls/$pr_number/reviews';
// generate URL for review calls
function getReviewURL(prID) {
  const repo = window.location.href.match(locationRepoRegex);
  return repo.length > 1
    ? `https://api.github.com/repos/picmonkey/${repo[1]}/pulls/${prID}/reviews`
    : `https://api.github.com/repos/picmonkey/picmonkey/pulls/${prID}/reviews`;
}

// ------------------------------
// 'https://api.github.com/repos/picmonkey/picmonkey/pulls/$pr_number';
// generate URL for review calls
function getPRURL(prID) {
  const repo = window.location.href.match(locationRepoRegex);
  return repo.length > 1
    ? `https://api.github.com/repos/picmonkey/${repo[1]}/pulls/${prID}`
    : `https://api.github.com/repos/picmonkey/picmonkey/pulls/${prID}`;
}

function getReviewFilteringURL() {
  const endpoint = 'https://api.github.com/search/issues?q=is:open+is:pr+review:approved+label:"Code complete"';
  const repo = window.location.href.match(locationRepoRegex);
  return repo.length > 1 ? `${endpoint}+repo:picmonkey/${repo[1]}` : endpoint;
}

function getReviewFilteringHref(prIDs) {
  const repo = window.location.href.match(locationRepoRegex);
  return repo.length > 1
    ? `/picmonkey/${repo[1]}/issues?q=is:pr+is:open+${prIDs}`
    : `/picmonkey/picmonkey/issues?q=is:pr+is:open+${prIDs}`;
}
