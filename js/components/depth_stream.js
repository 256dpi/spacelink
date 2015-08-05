/**
 * Create new DepthStream client.
 *
 * Events: 'data'.
 *
 * @param address
 * @param stream
 * @constructor
 */
function DepthStream(address, stream){
  var self = this;

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
    self.emit('data', new Uint16Array(message.data));
  };

  this.ws = ws;

  SimpleEmitter.call(this);
}

DepthStream.prototype = Object.create(SimpleEmitter.prototype);

/**
 * Close client.
 */
DepthStream.prototype.close = function(){
  this.ws.close();
};
