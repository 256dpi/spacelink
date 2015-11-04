/**
 * Create a new Logger.
 *
 * @param network
 * @param renderEngine
 * @param configManager
 * @constructor
 */
var Logger = function(network, renderEngine, configManager){
  this.renders = 0;
  this.inB = 0;
  this.outB = 0;

  var self = this;
  this.hud = $('#hud');

  network.on('in', function(bytes){
    self.inB += bytes;
  });

  network.on('out', function(bytes){
    self.outB += bytes;
  });

  renderEngine.on('render', function(){
    self.renders++;
  });

  setInterval(function(){
    var g = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    var s = self.renders + ' R/s' + g;
    s += '→ ' + Math.round(self.inB / 1024 * 100) / 100 + ' KB/s' + g;
    s += '← ' + Math.round(self.outB / 1024 * 100) / 100 + ' KB/s' + g;
    s += network.nodes.length + ' P' + g;
    s += (configManager.get('enabled') ? 'E' : '');
    s += (configManager.get('mute') ? 'M' : '');
    s += (network.speaking ? 'S' : '');

    self.hud.html(s);

    self.renders = 0;
    self.inB = 0;
    self.outB = 0;
  }, 1000);

  configManager.on('debug', function(yes){
    yes ? self.hud.show() : self.hud.hide();
  });
};

module.exports = Logger;
