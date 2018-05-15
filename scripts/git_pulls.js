const jiraNumberRegex = /([a-z0-9]{2,5}-\d{1,4})/gi;

// ------------------------------------------------------------------
// adds Jira issue link next to PR
function addJiraAnchor() {
  const anchorClass = 'jira-anchor';

  function insertAnchor(anchor, title) {
    if (!title) return null;

    let jiraAnchor;
    for (let i = 0; i < title.length; i++) {
      jiraAnchor = document.createElement('a');
      jiraAnchor.setAttribute('href', `https://picmonkey.atlassian.net/browse/${title[i]}`);
      jiraAnchor.setAttribute('target', '_blank');
      jiraAnchor.setAttribute('class', anchorClass);
      jiraAnchor.setAttribute('style', 'margin-right: 5px;');
      jiraAnchor.innerHTML = '<>';

      anchor.parentNode.insertBefore(jiraAnchor, anchor);
    }
  }
  const issueList = document.getElementsByClassName('js-issue-row');
  const replaced = document.getElementsByClassName(anchorClass);

  if (replaced.length === 0) {
    for (let i = 0; i < issueList.length; i++) {
      const jiraTitle = issueList[i].querySelectorAll('.js-navigation-open')[0];
      // could be multiple issues
      const jiraNumber = jiraTitle.innerHTML.match(jiraNumberRegex);

      insertAnchor(jiraTitle, jiraNumber);
    }
  }
}

// ------------------------------------------------------------------
// QA help - adds copy issue btn
function addCopyBtnPR() {
  const copyBtnClass = 'jira-copy-issue';

  function insertBtn(anchor, jiraNumber, copyString) {
    function copyToClipboard() {
      navigator.clipboard.writeText(copyString);
    }

    let copyBtn = document.createElement('button');
    copyBtn.setAttribute('id', `jira-copy-id-${jiraNumber}`);
    copyBtn.setAttribute('class', copyBtnClass);
    copyBtn.setAttribute('style', 'padding: 0 5px; display: inline-block; border-radius: 10px;');
    copyBtn.innerHTML = 'C';

    anchor.parentNode.insertBefore(copyBtn, anchor);

    document
      .getElementById(`jira-copy-id-${jiraNumber}`)
      .addEventListener('click', copyToClipboard);
  }
  const issueList = document.getElementsByClassName('js-issue-row');
  const added = document.getElementsByClassName(copyBtnClass);

  if (added.length === 0) {
    for (let i = 0; i < issueList.length; i++) {
      const jiraTitle = issueList[i].querySelectorAll('.js-navigation-open')[0];

      const jiraNumber = jiraTitle.innerHTML.match(jiraNumberRegex);
      // [V3-123] text - URL
      const copyString = `${jiraTitle.innerHTML
        .trim()
        .replace(jiraNumberRegex, `[${jiraNumber}]`)} - https://github.com${jiraTitle.getAttribute(
        'href'
      )}`;

      insertBtn(jiraTitle, jiraNumber, copyString);
    }
  }
}

// ------------------------------------------------------------------
// branch names
function callApi(prURL, pToken, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', prURL, true);
  xhr.setRequestHeader('Content-type', 'application/vnd.github.symmetra-preview+json');
  xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
  xhr.setRequestHeader('Authorization', `token ${pToken}`);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(JSON.parse(xhr.response));
    }
  };
  xhr.send();
}

function getBranchData(pToken) {
  function insertBranchData(anchor, pr) {
    const container = document.createElement('div');
    container.setAttribute('class', 'mt-1 text-small text-gray');
    const branchData = document.createElement('span');
    branchData.innerHTML = `${pr.head.ref} -> ${pr.base.ref}`;

    container.appendChild(branchData);
    anchor.parentNode.appendChild(container);
  }

  const branchClass = 'jira-branch-data';
  const added = document.getElementsByClassName(branchClass);

  if (added.length === 0) {
    const prUrl = 'https://api.github.com/repos/picmonkey/picmonkey/pulls';
    callApi(prUrl, pToken, response => {
      const issueList = document.getElementsByClassName('js-issue-row');

      for (let i = 0; i < issueList.length; i++) {
        const prID = issueList[i].getAttribute('id').match(/(?<=issue_).*/gi);

        const pr = response.find(x => x.number == prID);
        const anchor = issueList[i].querySelectorAll('.opened-by')[0].parentNode;
        insertBranchData(anchor, pr);
      }
    });
  }
}

// ------------------------------------------------------------------
// script subscription
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.git_pulls) {
    chrome.storage.sync.get(
      {
        pToken: '',
        jiraAnchor: false,
        jiraBranchData: false,
        jiraCopy: false,
      },
      function({ jiraAnchor, jiraCopy, jiraBranchData, pToken }) {
        jiraAnchor && addJiraAnchor();
        jiraCopy && addCopyBtnPR();
        jiraBranchData && pToken.length && getBranchData(pToken);
      }
    );
  }
});
