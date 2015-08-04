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

  new DepthRender(
    'ws://10.128.137.196:9090',
    4,
    scene,
    -Math.PI/2,
    render
  );

  new DepthRender(
    'ws://10.128.137.196:9091',
    4,
    scene,
    Math.PI/2,
    render
  );

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
