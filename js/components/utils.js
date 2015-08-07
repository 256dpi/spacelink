function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2);
  var bufView = new Uint16Array(buf);
  for (var i= 0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function deg2rad(deg) {
  return deg * Math.PI / 180;
}
