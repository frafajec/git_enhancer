// ------------------------------------------------------------------
// When user copies checks if +- marks are inside and removes them
function addCopyOverride() {
  async function writeToClipboard(text = '') {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  async function readFromClipboard() {
    try {
      return await navigator.clipboard.readText();
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  }

  function stripChars(text = '') {
    text = text.replace(/^[+]/gm, '');
    text = text.replace(/^[-]/gm, '');
    return text;
  }

  async function onCopy(e) {
    const text = await readFromClipboard();
    writeToClipboard(stripChars(text));
  }

  document.addEventListener('copy', onCopy);
}
