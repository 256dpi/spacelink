var ConfigManager = require('./components/config_manager');
var RenderEngine = require('./components/render_engine');
var OrientationManager = require('./components/orientation_manager');
var Network = require('./components/network');
var DepthRender = require('./components/depth_render');
var RemoteStream = require('./components/remote_stream');
var Utils = require('./components/utils');
var Logger = require('./components/logger');

var REDUCE = 4;

var cm = new ConfigManager();
var re = new RenderEngine(cm);
var om = new OrientationManager();
var n = new Network(cm);
var l = new Logger(n, re, cm);

n.on('found', function(node){
  node.render = new DepthRender(new RemoteStream(node), REDUCE, re, om.obtain(node));
});

n.on('lost', function(node){
  node.render.stop();
  om.free(node);
});

cm.initialize();
Utils.hideInactiveCursor();

n.connect();
re.start();
