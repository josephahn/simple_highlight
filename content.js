var getSelectionHtml = function() {
  var html = "";
  var sel = window.getSelection();
  if (sel.rangeCount) {
    var container = document.createElement("div");
    container.appendChild(sel.getRangeAt(0).cloneContents());
    html = container.innerHTML;
  }

  var anchorNode = sel.anchorNode;
  var focusNode = sel.focusNode;
  var range = sel.getRangeAt(0);
  // console.log('RANGE');
  // console.dir(range);
  console.log('ANCHOR === FOCUS: ' + (anchorNode === focusNode).toString());

  // MOVE HIGHLIGHTING LOGIC INTO SEPERATE FUNCTION
  // SHOULD HANDLE BOTH CASES, WHEN ANCHOR & FOCUS NODES ARE EQUAL/NOTEQUAL
  if (anchorNode === focusNode) {
    var span = document.createElement("span");
    span.className = "highlighted";
    span.style.backgroundColor = "yellow";
    range.surroundContents(span);
  } else {
    console.log('ERROR: PARTIAL SELECTED DOM NODES');
  }
  return html;
};

$(function() {
  $('body').on('mouseup', function(){
    var selection = getSelectionHtml();
    console.log('SELECTED TEXT: ' + selection);
    console.log('++++++++++++++++');
  });
});
