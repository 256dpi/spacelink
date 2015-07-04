
var renderer = new THREE.WebGLRenderer( { antialias: true } );

document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0, 100);

var controls = new THREE.VRControls(camera);

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(geometry, material);

cube.position.z = -0.3;

scene.add(cube);

function animate() {
  cube.rotation.y += 0.01;
  controls.update();
  effect.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

document.body.addEventListener('dblclick', function() {
  effect.setFullScreen(true);
});

function onkey(event) {
  event.preventDefault();

  if (event.keyCode == 90) { // z
    controls.zeroSensor();
  }
};

window.addEventListener('keydown', onkey, true);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  effect.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
