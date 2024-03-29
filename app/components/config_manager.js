var SimpleEmitter = require('./simple_emitter');

/**
 * Create a new ConfigManager.
 *
 * @constructor
 */
function ConfigManager(){
  var self = this;

  this.cache = {};

  window.addEventListener('keydown', function(event) {
    ConfigManager.MAPPING.forEach(function(config){
      if(event.keyCode == config.code) {
        if('state' in config) {
          config.state = !config.state;
          self.cache[config.name] = config.state;
          self.emit(config.name, config.state);
        } else {
          self.emit(config.name);
        }
        event.preventDefault();
      }
    });
  }, true);

  window.addEventListener('resize', function(){
    self.emit('resize');
  }, false);

  document.body.addEventListener('dblclick', function() {
    self.emit('dblclick');
  });

  SimpleEmitter.call(this);
}

ConfigManager.prototype = Object.create(SimpleEmitter.prototype);

/**
 * The mapping.
 */
ConfigManager.MAPPING = [
  { code: 13, name: 'enabled', state: true }, // enter
  { code: 68, name: 'debug', state: false }, // d
  { code: 86, name: 'vr', state: false }, // v
  { code: 77, name: 'mute', state: true }, // m
  { code: 32, name: 'reset' } // space
];

/**
 * Initialize the manager and emit default events once.
 */
ConfigManager.prototype.initialize = function(){
  var self = this;
  ConfigManager.MAPPING.forEach(function(config){
    if('state' in config) {
      self.cache[config.name] = config.state;
      self.emit(config.name, config.state);
    }
  });
};

/**
 * Get a certain configuration.
 *
 * @param name
 */
ConfigManager.prototype.get = function(name) {
  return this.cache[name];
};

module.exports = ConfigManager;
