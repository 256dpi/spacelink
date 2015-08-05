/**
 * Create a new SimpleEmitter.
 *
 * @constructor
 */
SimpleEmitter = function(){
  this.callbacks = {};
};

/**
 * Register event handler for 'found' and 'lost'.
 *
 * @param event
 * @param callback
 */
SimpleEmitter.prototype.on = function(event, callback) {
  this.callbacks[event] = callback;
};

/**
 * Emit an event to the registered callback.
 *
 * @param event
 * @param data
 */
SimpleEmitter.prototype.emit = function(event, data) {
  var cb = this.callbacks[event];
  if(cb) cb(data);
};
