// ------------------------------------------------------------------
// highlights selected word
function addHighlighting() {
  // checks what is selected
  function getSelectedText() {
    var text = '';
    if (typeof window.getSelection != 'undefined') {
      text = window.getSelection().toString();
    } else if (typeof document.selection != 'undefined' && document.selection.type == 'Text') {
      text = document.selection.createRange().text;
    }
    return text;
  }

  // propagates in DOM until it finds parent ancestor
  function findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  // get all elements with desired text
  function findElementsWithText(text, elements) {
    return [].filter.call(elements, function(element) {
      return RegExp(text).test(element.textContent);
    });
  }

  // remove previous highlights
  function cleanPrevious(scope, local = true) {
    const tag = local ? 'h' : 'hh';
    const highlights = scope.querySelectorAll(tag);
    highlights.forEach(element => {
      const content = element.parentElement.innerHTML;
      const highlight = local ? content.match(/(?<=<h>)(.*?)(?=<\/h>)/gi) : content.match(/(?<=<hh>)(.*?)(?=<\/hh>)/gi);
      if (highlight) {
        element.parentElement.innerHTML = content.replace(
          new RegExp(`<${tag}>${highlight[0]}</${tag}>`, 'g'),
          highlight[0]
        );
      }
    });
  }

  function highlightText(e) {
    var selectedText = getSelectedText();

    // if text is selected, check where and highlight
    if (selectedText && e.altKey) {
      // global select (whole visible PR)
      if (e.metaKey) {
        cleanPrevious(document.getElementById('files'), false);

        findElementsWithText(selectedText, document.querySelectorAll('.blob-code-inner')).forEach(element => {
          element.innerHTML = element.innerHTML.replace(new RegExp(selectedText, 'g'), `<hh>${selectedText}</hh>`);
        });
        return;
      }

      // local select (single file)
      const fileTable = findAncestor(e.target, 'diff-table');
      // if no table was found, click originated outside code block
      if (fileTable) {
        cleanPrevious(fileTable);
        findElementsWithText(selectedText, fileTable.querySelectorAll('.blob-code-inner')).forEach(element => {
          element.innerHTML = element.innerHTML.replace(new RegExp(selectedText, 'g'), `<h>${selectedText}</h>`);
        });
      }
    }
  }

  document.onmouseup = highlightText;
}
