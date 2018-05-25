// ------------------------------------------------------------------
// QA help - adds copy issue btn
function addCopyBtnPR() {
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
    const jiraTitle = document.querySelectorAll('.gh-header-title .js-issue-title')[0];
    const prNumber = document.querySelectorAll('.gh-header-number')[0].innerHTML;

    const jiraNumber = jiraTitle.innerHTML.match(jiraNumberRegex);
    // [V3-123 / #1234] text
    const copyString = `${jiraTitle.innerHTML.trim().replace(jiraNumberRegex, `[${jiraNumber} / ${prNumber}]`)}`;

    insertBtn(jiraTitle, jiraNumber, copyString);
  }
}
