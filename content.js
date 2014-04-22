var highlightSpan = function() {
  var span = document.createElement("span");
  span.className = "highlighted";
  span.style.backgroundColor = "yellow";
  return span;
}

var highlight = function(anchorNode, anchorOffset, focusNode, focusOffset, range) {
  // var span = document.createElement("span");
  // span.className = "highlighted";
  // span.style.backgroundColor = "yellow";
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
      // debugger;
      var nodes = [];
      var highlighted = false;
      var recurseNodes = function(nodeList) {

        for (var i = 0; i < nodeList.length; i++) {
          console.log('i: ' + i);
          console.dir(nodeList[i]);

          if (nodeList[i].className !== "highlighted") {
            if (highlighted) {
              // if (range.endContainer === nodeList[i]) {
              if (focusNode === nodeList[i]) {
                console.log('FOUND END CONTAINER');
                console.dir(nodeList[i]);
                nodes.push(nodeList[i]);
                highlighted = false;

                // console.log('HIGHLIGHT APPLIED');
                // var newRange = document.createRange();
                // newRange.setStart(nodeList[i], 0);
                // newRange.setEnd(nodeList[i], focusOffset);
                // newRange.surroundContents(span);
                // newRange.detach();

                // console.log('RETURN');
                // return;
              } else {
                console.log('WHOLE DOM NODE');
                console.log(nodeList[i]);
                if (nodeList[i].nodeType === 3 && nodeList[i].textContent) {
                  console.log('FOUND TEXT NODE');
                  console.log(nodeList[i]);
                  nodes.push(nodeList[i]);

                  // console.log('HIGHLIGHT APPLIED');
                  // var newRange = document.createRange();
                  // newRange.selectNode(nodeList[i]); // selectNodeContents?
                  // newRange.surroundContents(span);
                  // newRange.detach();
                }
              }
            }
            if (anchorNode === nodeList[i]) {
              console.log('FOUND START CONTAINER');
              console.dir(nodeList[i]);
              nodes.push(nodeList[i]);
              highlighted = true;

              // TODO: highlighting creates more nodes... and causes weird disappearing bug
              // console.log('HIGHLIGHT APPLIED');
              // var newRange = document.createRange();
              // newRange.setStart(nodeList[i], anchorOffset);
              // newRange.setEnd(nodeList[i], nodeList[i].length);
              // newRange.surroundContents(span);
              // newRange.detach();
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
      // debugger;
      if (i === 0) {
        // var span = document.createElement("span");
        // span.className = "highlighted";
        // span.style.backgroundColor = "yellow";
        var newRange = document.createRange();
        newRange.setStart(nodesToHighlight[i], anchorOffset);
        newRange.setEnd(nodesToHighlight[i], nodesToHighlight[i].length);
        newRange.surroundContents(highlightSpan());
        newRange.detach();
      } else if (i === nodesToHighlight.length - 1) {
        // var span = document.createElement("span");
        // span.className = "highlighted";
        // span.style.backgroundColor = "yellow";
        var newRange = document.createRange();
        newRange.setStart(nodesToHighlight[i], 0);
        newRange.setEnd(nodesToHighlight[i], focusOffset);
        newRange.surroundContents(highlightSpan());
        newRange.detach();
      } else {
        // var span = document.createElement("span");
        // span.className = "highlighted";
        // span.style.backgroundColor = "yellow";
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
