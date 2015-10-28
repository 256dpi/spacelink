/**
 * Create a new SimpleEmitter.
 *
 * @constructor
 */
SimpleEmitter = function(){
  this.callbacks = {};
};

/**
 * Register event handler.
 *
 * @param event
 * @param callback
 */
SimpleEmitter.prototype.on = function(event, callback) {
  if(!this.callbacks[event]) {
    this.callbacks[event] = [];
  }

  this.callbacks[event].push(callback);
};

/**
 * Emit an event to the registered callbacks.
 *
 * @param event
 * @param data
 */
SimpleEmitter.prototype.emit = function(event, data) {
  if(!this.callbacks[event]) {
    this.callbacks[event] = [];
  }

  this.callbacks[event].forEach(function(cb){
    cb(data);
  });
};

module.exports = SimpleEmitter;
