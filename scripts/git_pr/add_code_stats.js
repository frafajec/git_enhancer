const kPageSize = 30;
const kMaxPages = 9;
const kResultId = 'pm_files_tab_stats';

function addCodeStats(pToken) {
  const prID = parseInt(document.querySelectorAll('.gh-header-number')[0].textContent.replace(/#/, ''), 10);
  const prFilesBaseURL = filesURL.replace(/\$pr_number/, prID);
  if (document.getElementById(kResultId)) return;
  const promisify = callbackBasedFunc =>
    new Promise((resolve, reject) => callbackBasedFunc((...args) => resolve(args)));
  const dataResolver = data => new Promise(resolve => resolve(data));
  const partial = (fn, ...fArgs) => (...rArgs) => fn.apply(null, [...fArgs, ...rArgs]);
  const requester = page => promisify(partial(gitApiCall, prFilesBaseURL.replace(/\$page/, page), pToken));
  const looper = (page, data) =>
    requester(page).then(
      ([response]) =>
        response && response.length === kPageSize && page < kMaxPages
          ? looper(page + 1, [...data, ...response])
          : dataResolver([...data, ...response])
    );
  looper(1, []).then(fileList => {
    if (!fileList.length) return;
    const numTestFiles = fileList.reduce((tests, { filename }) => tests + !!filename.match(/\.test\./gi), 0);
    const resultBox = document.createElement('span');
    resultBox.innerHTML = `Test related: ${numTestFiles} (${(numTestFiles / fileList.length).toFixed(2)})`;
    resultBox.id = kResultId;
    const fileTab = Array.from(document.querySelectorAll('.tabnav-pr .tabnav-tab')).pop();
    fileTab && fileTab.appendChild(resultBox);
  });
}
