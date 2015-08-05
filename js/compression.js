var ls = new LocalStream('ws://0.0.0.0:9090');

var once = false;

console.log('start compression test...');

ls.on('data', function(buf){
  if(once) return;
  once = true;

  var start = +new Date();

  var data = new Int8Array(buf);
  var data_16 = new Uint16Array(buf);

  LZMA.compress(data, 1, function(bytes){
    var json = JSON.stringify({bytes: bytes});
    var json2 = JSON.parse(json);

    LZMA.decompress(json2.bytes, function(data2){
      var _data2 = new Uint8Array(data2.length);
      for(var j = 0; j < data2.length; j++) {
        _data2[j] = data2[j];
      }

      var data2_16 = new Uint16Array(_data2.buffer);

      var end = +new Date();

      console.log('data:', Math.round(data.length / 1024) + 'kb,', data_16.length + ' points');
      console.log('compressed:', Math.round(bytes.length / 1024) + 'kb', 'json:', Math.round(json.length / 1024) + 'kb');
      console.log('check:', check(data_16, data2_16) && check(data, data2) ? 'ok' : 'invalid');
      console.log('time:', end - start + 'ms');

      ls.close();
    });
  });
});

function check(d1, d2) {
  var good = 0;

  for(var i=0; i<d1.length; i++) {
    if(d1[i] == d2[i]) good++;
  }
  return good == d1.length && good == d2.length;
}
