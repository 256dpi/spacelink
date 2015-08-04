/**
 * Create new Depthstream client.
 *
 * @param stream
 * @param callback
 * @constructor
 */
function DepthStream(stream, callback){
  var ws = new WebSocket('ws://localhost:9090');
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
