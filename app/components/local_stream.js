var SimpleEmitter = require('./simple_emitter');
/**
 * Create new LocalStream client.
 *
 * Events: 'data'.
 *
 * @param address
 * @constructor
 */
function LocalStream(address){
  var self = this;

  var ws = new WebSocket(address);
  ws.binaryType = 'arraybuffer';

  ws.onopen = function() {
    ws.send('*');
  };

  ws.onmessage = function(message) {
    self.emit('data', message.data);
  };

  this.ws = ws;

  SimpleEmitter.call(this);
}

LocalStream.prototype = Object.create(SimpleEmitter.prototype);

/**
 * Close client.
 */
LocalStream.prototype.close = function(){
  this.ws.close();
};

module.exports = LocalStream;
