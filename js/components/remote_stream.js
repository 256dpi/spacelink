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

  function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i= 0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  node.on('message', function(data){
    var data2 = str2ab(LZString.decompressFromUTF16(data.stream));
    if(data2) {
      self.emit('data', new Uint16Array(data2));
    }
  });

  SimpleEmitter.call(this);
}

RemoteStream.prototype = Object.create(SimpleEmitter.prototype);
