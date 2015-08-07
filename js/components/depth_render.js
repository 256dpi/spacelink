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

  this.particles = new THREE.BufferGeometry();
  this.positions = new Float32Array(640 / reduce * 480 / reduce * 3);
  this.particles.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));

  this.material = new THREE.PointCloudMaterial({
    color: 0xFFFFFF,
    size: reduce / 4
  });

  this.system = new THREE.PointCloud(this.particles, this.material);
  this.system.rotation.y = rotation;
  this.system.frustumCulled = false;

  this.renderEngine.scene.add(this.system);

  this.transformation = new DepthTransformation(reduce, this.particles);

  this.stream.on('data', function(data){
    var array = new Uint16Array(data);
    self.transformation.update(array);
    self.particles.verticesNeedUpdate = true;
  });
}

/**
 * Stop renderer.
 */
DepthRender.prototype.stop = function(){
  this.renderEngine.scene.remove(this.system);
};
