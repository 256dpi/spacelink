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
    LZMA.decompress(data.stream, function(data){
      var data2 = new Uint8Array(data.length);
      for(var j = 0; j < data.length; j++) {
        data2[j] = data[j];
      }

      var array = new Uint16Array(data2.buffer);
      
      self.emit('data', array);
    });
  });

  SimpleEmitter.call(this);
}

RemoteStream.prototype = Object.create(SimpleEmitter.prototype);
