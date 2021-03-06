// ------------------------------------------------------------------
// QA help - adds copy issue btn
function addCopyBtnPulls() {
  function insertBtn(anchor, jiraNumber, copyString) {
    function copyToClipboard() {
      navigator.clipboard.writeText(copyString);
    }

    const copyBtn = document.createElement('img');
    copyBtn.setAttribute('id', `jira-copy-id-${jiraNumber}`);
    copyBtn.setAttribute('class', copyBtnClass);
    copyBtn.setAttribute('src', copyIconSrc);

    anchor.parentNode.insertBefore(copyBtn, anchor);
    document.getElementById(`jira-copy-id-${jiraNumber}`).addEventListener('click', copyToClipboard);
  }

  const alreadyAdded = document.getElementsByClassName(copyBtnClass);
  if (alreadyAdded.length === 0) {
    const issueList = document.getElementsByClassName('js-issue-row');
    for (let i = 0; i < issueList.length; i++) {
      const jiraTitle = issueList[i].querySelectorAll('.js-navigation-open')[0];
      const jiraNumber = jiraTitle.innerHTML.match(jiraNumberRegex);
      const prNumber = issueList[i].querySelectorAll('.opened-by')[0].innerText.match(/#\d{1,4}/)[0];

      // [V3-123] text - URL
      const copyString = `${jiraTitle.innerHTML.trim().replace(jiraNumberRegex, `[${jiraNumber} / ${prNumber}]`)}`;

      insertBtn(jiraTitle, jiraNumber, copyString);
    }
  }
}
