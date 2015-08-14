/**
 * Get a query parameter.
 *
 * @param name
 * @returns {string}
 */
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * Convert ArrayBuffer to String.
 *
 * @param buf
 * @returns {string}
 */
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

/**
 * Convert String to ArrayBuffer.
 * @param str
 * @returns {ArrayBuffer}
 */
function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2);
  var bufView = new Uint16Array(buf);
  for (var i= 0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * Calcualte degress from radians.
 *
 * @param deg
 * @returns {number}
 */
function deg2rad(deg) {
  return deg * Math.PI / 180;
}

/**
 * Hide inactive cursor:
 */

function hideInactiveCursor() {
  var mouseTimer = null;
  var cursorVisible = true;

  function disappearCursor() {
    mouseTimer = null;
    document.body.style.cursor = 'none';
    cursorVisible = false;
  }

  document.onmousemove = function() {
    if(mouseTimer) {
      window.clearTimeout(mouseTimer);
    }

    if(!cursorVisible) {
      document.body.style.cursor = 'default';
      cursorVisible = true;
    }

    mouseTimer = window.setTimeout(disappearCursor, 200);
  };
}
