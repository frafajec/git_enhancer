// ------------------------------------------------------------------
// calls github endpoint
function gitApiCall(prURLs, pToken, callback) {
  function request(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Content-type', 'application/vnd.github.symmetra-preview+json');
      xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
      xhr.setRequestHeader('Authorization', `token ${pToken}`);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          resolve(JSON.parse(xhr.response));
        }
      };
      xhr.onerror = reject;
      xhr.send();
    });
  }

  if (Array.isArray(prURLs)) {
    Promise.all(prURLs.map(url => request(url))).then(callback);
  } else {
    request(prURLs).then(callback);
  }
}
