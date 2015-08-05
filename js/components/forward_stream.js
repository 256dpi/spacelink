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

  stream.on('data', function(data){
    if(i == 0) {
      LZMA.compress(new Int8Array(data), 1, function(bytes){
        network.broadcast({stream: bytes});
      });
    } else if(i == 30) {
      i = -1;
    }

    i++;
  });

  SimpleEmitter.call(this);
}

ForwardStream.prototype = Object.create(SimpleEmitter.prototype);
