/**
 * Create new ForwardStream client.
 *
 * Events: 'data'.
 *
 * @param stream
 * @param network
 * @constructor
 */
function ForwardStream(stream, network){
  var i = 0;

  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

  stream.on('data', function(data){
    if(i == 0) {
      var bytes = LZString.compressToUTF16(ab2str(data));
      if(bytes) {
        network.broadcast({stream: bytes});
      }
    } else if(i == 30) {
      i = -1;
    }

    i++;
  });

  SimpleEmitter.call(this);
}

ForwardStream.prototype = Object.create(SimpleEmitter.prototype);
