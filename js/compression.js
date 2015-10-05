var ls = new LocalStream('ws://0.0.0.0:9090');

var once = false;

document.open();
document.write('start compression test...<br>');

ls.on('data', function(buf){
  if(once) return;
  once = true;

  var start = +new Date();

  var data = new Int8Array(buf);
  var data_16 = new Uint16Array(buf);

  var bytes = LZString.compressToUTF16(ab2str(buf));

  var json = JSON.stringify({bytes: bytes});
  var json2 = JSON.parse(json);

  var data2 = str2ab(LZString.decompressFromUTF16(json2.bytes));

  var data2_16 = new Uint16Array(data2);

  var end = +new Date();

  document.write('data: ' + Math.round(data.length / 1024) + 'kb, ' + data_16.length + ' points<br>');
  document.write('compressed: ' + Math.round(bytes.length / 1024) + 'kb json: ' + Math.round(json.length / 1024) + 'kb<br>');
  document.write('check: ' + check(data_16, data2_16) ? 'ok<br>' : 'invalid<br>');
  document.write('time: ' +  (end - start) + 'ms<br>');

  ls.close();
  document.close();
});

function check(d1, d2) {
  var good = 0;

  for(var i=0; i<d1.length; i++) {
    if(d1[i] == d2[i]) good++;
  }
  return good == d1.length && good == d2.length;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i= 0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
