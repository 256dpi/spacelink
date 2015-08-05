/**
 * Create new DepthStream client.
 *
 * Events: 'data'.
 *
 * @param address
 * @constructor
 */
function DepthStream(address){
  var self = this;

  var ws = new WebSocket(address);
  ws.binaryType = 'arraybuffer';

  ws.onopen = function() {
    ws.send('*');
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
