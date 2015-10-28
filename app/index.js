var ConfigManager = require('./components/config_manager');
var RenderEngine = require('./components/render_engine');
var OrientationManager = require('./components/orientation_manager');
var Network = require('./components/network');
var LocalStream = require('./components/local_stream');
var DepthRender = require('./components/depth_render');
var ForwardStream = require('./components/forward_stream');
var RemoteStream = require('./components/remote_stream');
var Utils = require('./components/utils');

var REDUCE = 4;
var SKIP = 4;

var cm = new ConfigManager();
var re = new RenderEngine(cm);
var om = new OrientationManager();
var n = new Network(cm);

var ls = new LocalStream('ws://0.0.0.0:9090');
new DepthRender(ls, REDUCE, re, om.obtain(ls));
new ForwardStream(ls, n, SKIP);

n.on('found', function(node){
  node.render = new DepthRender(new RemoteStream(node), REDUCE, re, om.obtain(node));
});

n.on('lost', function(node){
  node.render.stop();
  om.free(node);
});

var stats = {
  renders: 0,
  inB: 0,
  outB: 0
};

n.on('in', function(bytes){
  stats.inB += bytes;
});

n.on('out', function(bytes){
  stats.outB += bytes;
});

re.on('render', function(){
  stats.renders++;
});

setInterval(function(){
  $('.renders').html(stats.renders + ' R/s');
  $('.in').html('← ' + Math.round(stats.inB / 1024 * 100) / 100 + ' KB/s');
  $('.out').html('→ ' + Math.round(stats.outB / 1024 * 100) / 100 + ' KB/s');
  $('.nodes').html(n.nodes.length + ' P');
  $('.flags').html((cm.get('enabled') ? 'E' : '') + (cm.get('mute') ? 'M' : '') + (n.speaking ? 'S' : ''));
  stats.renders = 0;
  stats.inB = 0;
  stats.outB = 0;
}, 1000);

cm.on('debug', function(yes){
  var hud = $('#hud');
  yes ? hud.show() : hud.hide();
});

cm.start();
Utils.hideInactiveCursor();

n.connect();
re.start();
