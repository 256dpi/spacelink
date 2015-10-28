/**
 * Create new ForwardStream client.
 *
 * Events: 'data'.
 *
 * @param stream
 * @param network
 * @param drop
 * @constructor
 */
function ForwardStream(stream, network, drop){
  var i = 0;

  stream.on('data', function(data){
    if(i == 0) {
      var bytes = LZString.compressToUTF16(ab2str(data));
      if(bytes) {
        network.broadcast({stream: bytes});
      }
    } else if(i == drop) {
      i = -1;
    }

    i++;
  });

  SimpleEmitter.call(this);
}

ForwardStream.prototype = Object.create(SimpleEmitter.prototype);

module.exports = ForwardStream;
