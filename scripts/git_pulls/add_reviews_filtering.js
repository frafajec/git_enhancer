// ------------------------------------------------------------------
// used as a placeholder for data poll
function addReviewsFiltering(pToken) {
  // Don't spam the API
  const reviewFilteringAdded = document.getElementsByClassName(reviewsPullsFilteringClass);
  if (reviewFilteringAdded.length) return;

  // is:open is:pr label:"Code Complete" review:approved
  gitApiCall(getReviewFilteringURL(), pToken, res => {
    const reviewIDs = res.items.map(pr => pr.number);
    const reviewURLs = reviewIDs.map(prID => getReviewURL(prID));

    gitApiCall(reviewURLs, pToken, res => {
      // verify not yet added
      const reviewFilteringAdded = document.getElementsByClassName(reviewsPullsFilteringClass);
      if (reviewFilteringAdded.length) return;

      // combine PRs and reviews
      const prReviews = {};
      for (let i = 0; i < reviewIDs.length; i++) {
        prReviews[reviewIDs[i]] = res[i];
      }

      const seattleApproved = [];
      const psideApproved = [];

      // add data for each PR
      for (prID in prReviews) {
        // ------------------------------
        // uniquify reviews per user
        const reviews = uniquifyReviews(prReviews[prID].reverse());

        // ------------------------------
        // collect reviews
        const { seattleReview, psideReview } = getReviewStates(reviews);

        // ------------------------------
        // Seattle/Pside filtering
        if (seattleReview.state === REVIEW_STATE.APPROVED) seattleApproved.push(prID);
        if (psideReview.state === REVIEW_STATE.APPROVED) psideApproved.push(prID);
      }

      // ------------------------------
      // insert in DOM
      // seattle approved
      const btnSeattleQA = document.createElement('a');
      btnSeattleQA.setAttribute('class', `js-selected-nativation-item subnav-item ${reviewsPullsFilteringClass}`);
      btnSeattleQA.setAttribute('href', getReviewFilteringHref(seattleApproved.join('+')));
      btnSeattleQA.innerHTML = 'S';
      // pside approved
      const btnPsideQA = document.createElement('a');
      btnPsideQA.setAttribute('class', `js-selected-nativation-item subnav-item ${reviewsPullsFilteringClass}`);
      btnPsideQA.setAttribute('href', getReviewFilteringHref(psideApproved.join('+')));
      btnPsideQA.innerHTML = 'P';
      // all approved
      const btnReviewed = document.createElement('a');
      btnReviewed.setAttribute('class', `js-selected-nativation-item subnav-item ${reviewsPullsFilteringClass}`);
      btnReviewed.setAttribute('href', getReviewFilteringHref([...seattleApproved, ...psideApproved].join('+')));
      btnReviewed.innerHTML = 'QA review';

      // insert into dom
      const headerAnchor = document.querySelectorAll(`.${dataHeaderClass} .box-filtering`)[0];
      if (!headerAnchor) return;

      headerAnchor.appendChild(btnSeattleQA);
      headerAnchor.appendChild(btnReviewed);
      headerAnchor.appendChild(btnPsideQA);
    });
  });
}
