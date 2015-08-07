function RenderEngine(debug, vr) {
  var self = this;

  this.controls = [];

  this.createScene();
  this.createCamera();
  this.createRenderer();
  this.addFloor();

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

RenderEngine.prototype.createScene = function(){
  this.scene = new THREE.Scene();
  return this.scene;
};

RenderEngine.prototype.createCamera = function(){
  this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  this.camera.position.set(20, 0, 0);
  //this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  return this.camera;
};

RenderEngine.prototype.createRenderer = function(){
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  $('body').prepend(this.renderer.domElement);
  return this.renderer;
};

RenderEngine.prototype.addFloor = function(){
  var geometry = new THREE.CircleGeometry(1500, 100);
  var material = new THREE.MeshBasicMaterial({ color: 0x222222 });
  this.floor = new THREE.Mesh(geometry, material);
  this.floor.material.side = THREE.DoubleSide;
  this.floor.rotation.x = deg2rad(90);
  this.scene.add(this.floor);
};

RenderEngine.prototype.addOrbitControls = function(){
  var controls = new THREE.OrbitControls(this.camera);
  this.controls.push(controls);
};

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

RenderEngine.prototype.createVREffect = function(){
  var self = this;
  this.effect = new THREE.VREffect(this.renderer);
  this.effect.setSize(window.innerWidth, window.innerHeight);

  document.body.addEventListener('dblclick', function() {
    self.effect.setFullScreen(true);
  });
};

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

RenderEngine.prototype.update = function(){
  requestAnimationFrame(this.update.bind(this));

  this.controls.forEach(function(controls){
    controls.update();
  });

  this.render();
};

RenderEngine.prototype.start = function(){
  this.update();
};
