/**
 * Create new RenderEngine.
 *
 * @param debug
 * @param vr
 * @constructor
 */
function RenderEngine(debug, vr) {
  var self = this;

  this.controls = [];

  this.createScene();
  this.createCamera();
  this.createRenderer();
  this.addFloor();
  this.addFog();

  if(debug) {
    this.scene.add(new THREE.AxisHelper(100));
  }

  if(vr) {
    this.addVRControls();
    this.createVREffect();
  } else {
    this.addOrbitControls();
  }

  function onWindowResize() {
    self.renderer.setSize(window.innerWidth, window.innerHeight);
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();

    if(self.effect) {
      self.effect.setSize(window.innerWidth, window.innerHeight);
    }
  }

  window.addEventListener('resize', onWindowResize, false);

  this.enabled = true;

  window.addEventListener('keydown', function(event) {
    if (event.keyCode == 13) { // enter
      event.preventDefault();
      self.enabled = !self.enabled;
    }
  }, true);

  SimpleEmitter.call(this);
}

RenderEngine.prototype = Object.create(SimpleEmitter.prototype);

/**
 * Create Scene.
 */
RenderEngine.prototype.createScene = function(){
  this.scene = new THREE.Scene();
};

/**
 * Create Camera.
 */
RenderEngine.prototype.createCamera = function(){
  this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 10000);
  this.camera.position.set(0, 120, 0);
};

/**
 * Create Renderer.
 */
RenderEngine.prototype.createRenderer = function(){
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  $('body').prepend(this.renderer.domElement);
};

/**
 * Add floor to scene.
 */
RenderEngine.prototype.addFloor = function(){
  var geometry = new THREE.CircleGeometry(1500, 100);
  var material = new THREE.MeshBasicMaterial({ color: 0x222222 });
  this.floor = new THREE.Mesh(geometry, material);
  this.floor.material.side = THREE.DoubleSide;
  this.floor.rotation.x = deg2rad(90);
  this.scene.add(this.floor);
};

/**
 * Add fog to scene.
 */
RenderEngine.prototype.addFog = function(){
  this.scene.fog = new THREE.Fog(0x000000, 0, 3000);
};

/**
 * Add Orbit Controls.
 */
RenderEngine.prototype.addOrbitControls = function(){
  var controls = new THREE.OrbitControls(this.camera);
  controls.target.set(0, 0, 0);
  controls.rotateUp(deg2rad(-70));
  controls.rotateLeft(deg2rad(90));
  controls.dollyOut(5);
  controls.panUp(150);
  this.controls.push(controls);
};

/**
 * Add VR Controls.
 */
RenderEngine.prototype.addVRControls = function(){
  var controls = new THREE.VRControls(this.camera);
  this.controls.push(controls);

  window.addEventListener('keydown', function(event) {
    if (event.keyCode == 32) { // space
      event.preventDefault();
      controls.resetSensor();
    }
  }, true);
};

/**
 * Create VR Effect.
 */
RenderEngine.prototype.createVREffect = function(){
  var self = this;
  this.effect = new THREE.VREffect(this.renderer);
  this.effect.setSize(window.innerWidth, window.innerHeight);

  document.body.addEventListener('dblclick', function() {
    self.effect.setFullScreen(true);
  });
};

/**
 * Render scene.
 */
RenderEngine.prototype.render = function(){
  if(this.enabled) {
    if(this.effect) {
      this.effect.render(this.scene, this.camera);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
    this.emit('render');
  }
};

/**
 * On update cycle.
 */
RenderEngine.prototype.update = function(){
  requestAnimationFrame(this.update.bind(this));

  this.controls.forEach(function(controls){
    controls.update();
  });

  this.render();
};

/**
 * Start render loop.
 */
RenderEngine.prototype.start = function(){
  this.update();
};
