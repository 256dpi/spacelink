/**
 * Create a DepthRender that draws and receives a depth image.
 *
 * @param stream
 * @param reduce
 * @param renderEngine
 * @param rotation
 * @constructor
 */
function DepthRender(stream, reduce, renderEngine, rotation) {
  var self = this;
  this.stream = stream;
  this.renderEngine = renderEngine;

  this.width = 640 / reduce;
  this.height = 480 / reduce;
  this.total = this.width * this.height;

  this.particles = new THREE.BufferGeometry();
  this.positions = new Float32Array(this.total * 3);
  this.colors = new Float32Array(this.total * 3);
  this.particles.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
  this.particles.addAttribute('color', new THREE.BufferAttribute(this.colors, 3));

  this.material = new THREE.PointsMaterial({
    size: reduce / 2,
    vertexColors: THREE.VertexColors,
    sizeAttenuation: true
  });

  this.system = new THREE.Points(this.particles, this.material);
  this.system.rotation.y = rotation;
  this.system.position.z = -RenderEngine.SENSOR_DISTANCE;
  this.system.frustumCulled = false;

  this.renderEngine.scene.add(this.system);

  this.transformation = new DepthTransformation(this.width, this.height, this.particles);

  this.stream.on('data', function(data){
    var depth = new Uint16Array(data, 0, self.total);
    var color = new Uint8Array(data, self.total * 2, self.total * 3);
    self.transformation.update(depth, color);
  });
}

/**
 * Stop renderer.
 */
DepthRender.prototype.stop = function(){
  this.renderEngine.scene.remove(this.system);
};
