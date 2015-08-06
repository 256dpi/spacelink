$(function(){
  var re = new RenderEngine(true);
  new DepthRender(new LocalStream('ws://0.0.0.0:9090'), 8, re, -Math.PI/2);
  re.start();
});
