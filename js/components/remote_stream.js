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

  node.on('message', function(data){
    var data2 = str2ab(LZString.decompressFromUTF16(data.stream));
    if(data2) {
      self.emit('data', new Uint16Array(data2));
    }
  });

  SimpleEmitter.call(this);
}

RemoteStream.prototype = Object.create(SimpleEmitter.prototype);
