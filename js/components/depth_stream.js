/**
 * Create new Depthstream client.
 *
 * @param address
 * @param stream
 * @param callback
 * @constructor
 */
function DepthStream(address, stream, callback){
  var ws = new WebSocket(address);
  ws.binaryType = 'arraybuffer';

  ws.onopen = function() {
    if(stream) {
      ws.send('*');
    } else {
      ws.send('1');
    }
  };

  ws.onmessage = function(message) {
    callback(new Uint16Array(message.data));
  };

  this.ws = ws;
}

/**
 * Close client.
 */
DepthStream.prototype.close = function(){
  this.ws.close();
};
