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
    const prTitle = jiraTitle.innerHTML.trim();

    const jiraNumber = jiraTitle.innerHTML.match(jiraNumberRegex);
    // [V3-123 / #1234] text
    // const copyString = `${jiraTitle.innerHTML.trim().replace(jiraNumberRegex, `[${jiraNumber} / ${prNumber}]`)}`;

    // V3-123: text (adds :)
    const jiraIndex = prTitle.indexOf(jiraNumber[0]);
    const semiPosition = jiraIndex + jiraNumber[0].length;
    const copyString =
      prTitle[semiPosition] === ':' || jiraNumber.length > 1
        ? `${prTitle}`
        : `${prTitle.substr(0, semiPosition) + ': ' + prTitle.substr(semiPosition + 1)}`;

    insertBtn(jiraTitle, jiraNumber, copyString);
  }
}
