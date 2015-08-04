/**
 * Create new Depthstream client.
 *
 * @param stream
 * @param callback
 * @constructor
 */
function DepthStream(stream, callback){
  var ws = this.ws = new WebSocket('ws://localhost:9090');
  ws.binaryType = 'arraybuffer';

  ws.onopen = function() {
    if(stream) {
      ws.send('*');
    }
  };

  ws.onmessage = function(message) {
    callback(new Uint16Array(message.data));
  };
}

/**
 * Get a single frame.
 */
DepthStream.prototype.get = function(){
  this.ws.send('1');
};

/**
 * Close client.
 */
DepthStream.prototype.close = function(){
  this.ws.close();
};
