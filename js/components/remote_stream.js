/**
 * Create new RemoteStream client.
 *
 * Events: 'data'.
 *
 * @param node
 * @constructor
 */
function RemoteStream(node){
  var self = this;

  console.log('attach stream');

  node.on('message', function(data){
    LZMA.decompress(data.stream, function(array){
      self.emit('data', new Uint16Array(array));
    });
  });

  SimpleEmitter.call(this);
}

RemoteStream.prototype = Object.create(SimpleEmitter.prototype);
