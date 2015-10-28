var Utils = require('./utils');

/**
 * Create new OrientationManager.
 *
 * @constructor
 */
function OrientationManager(){
  var self = this;
  this.map = {};

  [
    Utils.deg2rad(0),
    Utils.deg2rad(180),
    Utils.deg2rad(90),
    Utils.deg2rad(270)
  ].forEach(function(pos){
     self.map[pos] = null;
  });
}

/**
 * Obtain a position;
 *
 * @param thing
 * @returns position
 */
OrientationManager.prototype.obtain = function(thing) {
  var self = this;
  var sel = null;

  Object.keys(this.map).forEach(function(pos){
    if(self.map[pos] == null && sel == null) {
      self.map[pos] = thing;
      sel = pos;
    }
  });

  return sel;
};

/**
 * Free position.
 *
 * @param thing
 */
OrientationManager.prototype.free = function(thing) {
  var self = this;

  Object.keys(this.map).forEach(function(pos){
    if(self.map[pos] == thing) {
      self.map[pos] = null;
    }
  });
};

module.exports = OrientationManager;
