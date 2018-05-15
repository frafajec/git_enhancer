// ------------------------------------------------------------------
// calls github endpoint
function gitApiCall(prURL, pToken, callback) {
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
