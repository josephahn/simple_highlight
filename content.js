var highlightSpan = function() {
  var span = document.createElement("span");
  span.className = "highlighted";
  span.style.backgroundColor = "yellow";
  return span;
};

var highlight = function(anchorNode, anchorOffset, focusNode, focusOffset, range) {
  // selection is within same DOM node
  if (anchorNode === focusNode) {
    range.surroundContents(highlightSpan());
    range.detach();
  } else { // selection spans multiple DOM nodes

    // nodeList containing start and end container nodes
    var ancestorChildNodes = range.commonAncestorContainer.childNodes;
    range.detach();

    var highlightNodes = function() {
      var nodes = [];
      var highlighted = false;
      var recurseNodes = function(nodeList) {

        for (var i = 0; i < nodeList.length; i++) {
          if (nodeList[i].className !== "highlighted") {
            if (highlighted) {
              if (focusNode === nodeList[i]) {
                nodes.push(nodeList[i]);
                highlighted = false;
              } else {
                if (nodeList[i].nodeType === 3 && nodeList[i].textContent) {
                  nodes.push(nodeList[i]);
                }
              }
            }
            if (anchorNode === nodeList[i]) {
              nodes.push(nodeList[i]);
              highlighted = true;
            }
            if (nodeList[i].hasChildNodes()) {
              recurseNodes(nodeList[i].childNodes);
            }
          }
        }
      };
      recurseNodes(ancestorChildNodes);
      return nodes;
    };

    // array of nodes to highlight
    var nodesToHighlight = highlightNodes();
    for (var i = 0; i < nodesToHighlight.length; i++) {
      var newRange = document.createRange();
      if (i === 0) {
        newRange.setStart(nodesToHighlight[i], anchorOffset);
        newRange.setEnd(nodesToHighlight[i], nodesToHighlight[i].length);
      } else if (i === nodesToHighlight.length - 1) {
        newRange.setStart(nodesToHighlight[i], 0);
        newRange.setEnd(nodesToHighlight[i], focusOffset);
      } else {
        newRange.selectNode(nodesToHighlight[i]);
      }
      newRange.surroundContents(highlightSpan());
      newRange.detach();
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
    // var selection = getSelectionHtml();
    getSelectionHtml();
  });
});
