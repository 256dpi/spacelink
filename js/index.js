$(function(){
  var stats = {
    renders: 0,
    inB: 0,
    outB: 0
  };

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.set(10, 10, 10);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  $('body').prepend(renderer.domElement);

  var controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', render);

  //scene.add(new THREE.AxisHelper(100));

  var port = getParameterByName('port');

  var ls = new LocalStream('ws://0.0.0.0:' + (port ? port : 9090));

  var om = new OrientationManager();

  new DepthRender(
    ls,
    8,
    scene,
    om.obtain(ls),
    render
  );

  var n = new Network(false);

  n.on('found', function(node){
    node.render = new DepthRender(
      new RemoteStream(node),
      8,
      scene,
      om.obtain(node),
      render
    );
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

  render();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
  }

  function render() {
    renderer.render(scene, camera);
    stats.renders++;
  }

  animate();

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
