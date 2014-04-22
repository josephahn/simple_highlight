var highlightSpan = function() {
  var span = document.createElement("span");
  span.className = "highlighted";
  span.style.backgroundColor = "yellow";
  return span;
}

var highlight = function(anchorNode, anchorOffset, focusNode, focusOffset, range) {
  console.log('ANCHOR === FOCUS: ' + (anchorNode === focusNode).toString());
  // selection is within same DOM node
  if (anchorNode === focusNode) {
    range.surroundContents(span);
    range.detach();
  } else { // selection spans multiple DOM nodes
    console.log('ERROR: PARTIAL SELECTED DOM NODES');

    // nodeList containing start and end container nodes
    var ancestorChildNodes = range.commonAncestorContainer.childNodes;
    range.detach();

    var highlightNodes = function() {
      var nodes = [];
      var highlighted = false;
      var recurseNodes = function(nodeList) {

        for (var i = 0; i < nodeList.length; i++) {
          console.log('i: ' + i);
          console.dir(nodeList[i]);

          if (nodeList[i].className !== "highlighted") {
            if (highlighted) {
              if (focusNode === nodeList[i]) {
                console.log('FOUND END CONTAINER');
                console.dir(nodeList[i]);
                nodes.push(nodeList[i]);
                highlighted = false;
              } else {
                console.log('WHOLE DOM NODE');
                console.log(nodeList[i]);
                if (nodeList[i].nodeType === 3 && nodeList[i].textContent) {
                  console.log('FOUND TEXT NODE');
                  console.log(nodeList[i]);
                  nodes.push(nodeList[i]);
                }
              }
            }
            if (anchorNode === nodeList[i]) {
              console.log('FOUND START CONTAINER');
              console.dir(nodeList[i]);
              nodes.push(nodeList[i]);
              highlighted = true;
            }
            if (nodeList[i].hasChildNodes()) {
              console.log('found children... recursing through: ');
              console.log(nodeList[i].childNodes);
              recurseNodes(nodeList[i].childNodes);
            }
          }
        }
      };
      recurseNodes(ancestorChildNodes);
      return nodes;
    };

    var nodesToHighlight = highlightNodes();
    for (var i = 0; i < nodesToHighlight.length; i++) {
      if (i === 0) {
        var newRange = document.createRange();
        newRange.setStart(nodesToHighlight[i], anchorOffset);
        newRange.setEnd(nodesToHighlight[i], nodesToHighlight[i].length);
        newRange.surroundContents(highlightSpan());
        newRange.detach();
      } else if (i === nodesToHighlight.length - 1) {
        var newRange = document.createRange();
        newRange.setStart(nodesToHighlight[i], 0);
        newRange.setEnd(nodesToHighlight[i], focusOffset);
        newRange.surroundContents(highlightSpan());
        newRange.detach();
      } else {
        var newRange = document.createRange();
        newRange.selectNode(nodesToHighlight[i]);
        newRange.surroundContents(highlightSpan());
        newRange.detach();
      }
    }
  }
};

var getSelectionHtml = function() {
  var html = "";
  var sel = window.getSelection();
  if (sel.rangeCount) {
    var container = document.createElement("div");
    container.appendChild(sel.getRangeAt(0).cloneContents());
    html = container.innerHTML;
  }

  var anchorNode = sel.anchorNode;
  var anchorOffset = sel.anchorOffset;
  var focusNode = sel.focusNode;
  var focusOffset = sel.focusOffset;
  var range = sel.getRangeAt(0);

  // highlight user selection
  highlight(anchorNode, anchorOffset, focusNode, focusOffset, range);

  // return selected text
  return html;
};

$(function() {
  $('body').on('mouseup', function(){
    var selection = getSelectionHtml();
    console.log('SELECTED TEXT: ' + selection);
    console.log('++++++++++++++++');
  });
});
