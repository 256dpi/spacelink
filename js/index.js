$(function(){
  // prepare stats
  var stats = {
    renders: 0,
    inB: 0,
    outB: 0
  };

  // get query parameters
  var port = parseInt(getParameterByName('port'));
  var vr = getParameterByName('vr') == 'yes';
  var debug = getParameterByName('debug') == 'yes';

  // create render engine
  var re = new RenderEngine(debug, vr);

  var ls = new LocalStream('ws://0.0.0.0:' + (port ? port : 9090));

  var om = new OrientationManager();

  new DepthRender(ls, 8, re, om.obtain(ls));

  var n = new Network(false);

  n.on('found', function(node){
    node.render = new DepthRender(new RemoteStream(node), 8, re, om.obtain(node));
  });

  n.on('lost', function(node){
    node.render.stop();
    om.free(node);
  });

  n.on('in', function(bytes){
    stats.inB += bytes;
  });

  n.on('out', function(bytes){
    stats.outB += bytes;
  });

  n.connect();

  new ForwardStream(ls, n, 4);

  re.on('render', function(){
    stats.renders++;
  });

  re.start();

  setInterval(function(){
    $('.renders').html(stats.renders + ' R/s');
    $('.in').html('← ' + Math.round(stats.inB / 1024 * 100) / 100 + ' KB/s');
    $('.out').html('→ ' + Math.round(stats.outB / 1024 * 100) / 100 + ' KB/s');
    $('.nodes').html(n.nodes.length + ' N');
    stats.renders = 0;
    stats.inB = 0;
    stats.outB = 0;
  }, 1000);
});

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
