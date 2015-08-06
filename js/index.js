$(function(){
  var config = {
    vr: getParameterByName('vr') == 'yes',
    debug: getParameterByName('debug') == 'yes'
  };

  var re = new RenderEngine(config.debug, config.vr);
  var ls = new LocalStream('ws://0.0.0.0:9090');
  var om = new OrientationManager();
  new DepthRender(ls, 8, re, om.obtain(ls));
  var n = new Network(false);
  new ForwardStream(ls, n, 4);

  n.on('found', function(node){
    node.render = new DepthRender(new RemoteStream(node), 8, re, om.obtain(node));
  });

  n.on('lost', function(node){
    node.render.stop();
    om.free(node);
  });

  if(!config.vr){
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
      $('.nodes').html(n.nodes.length + ' N');
      stats.renders = 0;
      stats.inB = 0;
      stats.outB = 0;
    }, 1000);
  } else {
    $('#hud').remove();
  }

  n.connect();
  re.start();
});
