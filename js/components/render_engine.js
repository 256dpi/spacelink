/**
 * Create new RenderEngine.
 *
 * @param configManager
 * @constructor
 */
function RenderEngine(configManager) {
  this.configManager = configManager;

  this.createScene();
  this.createCameras();
  this.createRenderer();
  this.createHelpers();
  this.createControls();
  this.createVRControls();
  this.createVREffect();

  SimpleEmitter.call(this);
}

RenderEngine.prototype = Object.create(SimpleEmitter.prototype);

RenderEngine.SENSOR_HEIGHT = 160;
RenderEngine.SENSOR_DISTANCE = 300;
RenderEngine.BODY_DISPLACEMENT_EGO = new THREE.Vector3(0, 0, -100);
RenderEngine.BODY_DISPLACEMENT_3P = new THREE.Vector3(0, 50, 50);

/**
 * Create Scene.
 */
RenderEngine.prototype.createScene = function(){
  this.scene = new THREE.Scene();

  this.floor = new THREE.Mesh(
    new THREE.CircleGeometry(1500, 100),
    new THREE.MeshBasicMaterial({ color: 0x222222 })
  );
  this.floor.material.side = THREE.DoubleSide;
  this.floor.rotation.x = deg2rad(90);
  this.floor.position.y = -RenderEngine.SENSOR_HEIGHT;
  this.scene.add(this.floor);
};

/**
 * Create Cameras.
 */
RenderEngine.prototype.createCameras = function(){
  var self = this;

  this.debugCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 10000);
  this.vrCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 10000);
  this.debugCamera.position.set(0, 0, 0);
  this.vrCamera.position.set(0, 0, 0);

  this.configManager.on('resize', function(){
    self.debugCamera.aspect = window.innerWidth / window.innerHeight;
    self.debugCamera.updateProjectionMatrix();
    self.vrCamera.aspect = window.innerWidth / window.innerHeight;
    self.vrCamera.updateProjectionMatrix();
  })
};

/**
 * Create Renderer.
 */
RenderEngine.prototype.createRenderer = function(){
  var self = this;

  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setSize(window.innerWidth, window.innerHeight);

  this.configManager.on('resize', function(){
    self.renderer.setSize(window.innerWidth, window.innerHeight);
  });

  $('body').prepend(this.renderer.domElement);
};

/**
 * Create center helpers.
 */
RenderEngine.prototype.createHelpers = function(){
  var self = this;

  // the logical center is the actual middle
  this.logicalCenter = new THREE.AxisHelper(100);
  this.scene.add(this.logicalCenter);

  // the virtual center is where the user stands in his room
  this.virtualCenter = new THREE.AxisHelper(50);
  this.virtualCenter.position.z = - RenderEngine.SENSOR_DISTANCE;
  this.virtualCenter.position.y = - RenderEngine.SENSOR_HEIGHT;
  this.scene.add(this.virtualCenter);

  // also show the current oculus position and rotation
  this.vrCenter = new THREE.AxisHelper(50);
  this.scene.add(this.vrCenter);

  this.configManager.on('debug', function(yes){
    self.logicalCenter.visible = yes;
    self.virtualCenter.visible = yes;
    self.vrCenter.visible = yes;
  });
};

/**
 * Add basic controls.
 */
RenderEngine.prototype.createControls = function(){
  this.orbitControls = new THREE.OrbitControls(this.debugCamera);
  this.orbitControls.target.set(0, -RenderEngine.SENSOR_HEIGHT, 0);
  this.orbitControls.rotateUp(deg2rad(-70));
  this.orbitControls.rotateLeft(deg2rad(90));
  this.orbitControls.dollyOut(5);
  this.orbitControls.panUp(150);
};

/**
 * Add VRControls.
 */
RenderEngine.prototype.createVRControls = function(){
  var self = this;
  this.vrControls = new THREE.VRControls(this.vrCamera);
  this.vrControls.scale = 100; // from meters to centimeters

  this.configManager.on('reset', function(){
    self.vrControls.resetSensor();
  });
};

/**
 * Create VR Effect.
 */
RenderEngine.prototype.createVREffect = function(){
  var self = this;

  this.effect = new THREE.VREffect(this.renderer);
  this.effect.setSize(window.innerWidth, window.innerHeight);

  this.configManager.on('resize', function(){
    self.effect.setSize(window.innerWidth, window.innerHeight);
  });

  this.configManager.on('dblclick', function(){
    self.effect.setFullScreen(true);
  });
};

/**
 * Render scene.
 */
RenderEngine.prototype.render = function(){
  if(this.configManager.get('enabled')) {
    if(this.configManager.get('vr')) {
      this.effect.render(this.scene, this.vrCamera);
    } else {
      // begin undoing some settings by VREffect
      var size = this.renderer.getSize();
      this.renderer.setViewport(0, 0, size.width, size.height);
      this.renderer.setScissor(0, 0, size.width, size.height);
      // end undo
      this.renderer.render(this.scene, this.debugCamera);
    }

    this.emit('render');
  }
};

/**
 * On update cycle.
 */
RenderEngine.prototype.update = function(){
  requestAnimationFrame(this.update.bind(this));

  this.orbitControls.update();

  if(this.vrControls.update()) {
    this.vrCamera.position.add(RenderEngine.BODY_DISPLACEMENT_3P);
  }

  // sync helper
  this.vrCenter.position.copy(this.vrCamera.position);
  this.vrCenter.quaternion.copy(this.vrCamera.quaternion);

  this.render();
};

/**
 * Start render loop.
 */
RenderEngine.prototype.start = function(){
  this.update();
};
