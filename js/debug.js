$(function(){
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
  camera.position.set(10, 10, 10);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.addEventListener('change', render);

  scene.add(new THREE.AxisHelper(100));

  var particles = new THREE.Geometry();
  var pMaterial = new THREE.PointCloudMaterial({
    color: 0xFFFFFF,
    size: 1
  });

  var pc = new PointCloud(particles.vertices);

  var particleSystem = new THREE.PointCloud(particles, pMaterial);

  scene.add(particleSystem);

  new DepthStream(true, function(array){
    pc.update(array);
    particles.verticesNeedUpdate = true;
    render();
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
