$(function(){
  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(10, 10, 10);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', render);

  scene.add(new THREE.AxisHelper(100));

  var ls = new LocalStream('ws://0.0.0.0:9090');

  new DepthRender(
    ls,
    16,
    scene,
    -Math.PI/2,
    render
  );

  var n = new Network(false);

  n.on('found', function(node){
    node.render = new DepthRender(
      new RemoteStream(node),
      16,
      scene,
      Math.PI/2,
      render
    );
  });

  n.on('lost', function(node){
    node.render.stop();
  });

  n.connect();

  var i = 0;

  ls.on('data', function(data){
    if(i == 0) {
      LZMA.compress(new Uint8Array(data), 1, function(bytes){
        n.broadcast({stream: bytes});
      });
    } else if(i == 30) {
      i = -1;
    }

    i++;
  });

  render();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
  }

  function render() {
    renderer.render(scene, camera);
  }

  animate();
});
