var ls = new LocalStream('ws://0.0.0.0:9090');

var once = false;

ls.on('data', function(buf){
  if(once) return;
  once = true;

  var data = new Int8Array(buf);
  var data_16 = new Uint16Array(buf);

  console.log('data:', data.length);
  console.log('data16:', data_16.length);

  LZMA.compress(data, 1, function(bytes){
    var json = JSON.stringify({bytes: bytes});

    console.log('compressed:', bytes.length, 'json:', json.length);

    var json2 = JSON.parse(json);

    LZMA.decompress(json2.bytes, function(data2){
      console.log('data2:', check(data, data2));

      var _data2 = new Uint8Array(data2.length);
      for(var j = 0; j < data2.length; j++) {
        _data2[j] = data2[j];
      }

      var data2_16 = new Uint16Array(_data2.buffer);

      console.log('data216:', check(data_16, data2_16));

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
