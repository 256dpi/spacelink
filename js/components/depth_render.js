/**
 * Create a DepthRender that draws and receives a depth image.
 *
 * @param address
 * @param reduce
 * @param scene
 * @param rotation
 * @param onUpdate
 * @constructor
 */
function DepthRender(address, reduce, scene, rotation, onUpdate) {
  this.onUpdate = onUpdate;

  this.particles = new THREE.Geometry();

  this.material = new THREE.PointCloudMaterial({
    color: 0xFFFFFF,
    size: reduce / 2
  });

  this.system = new THREE.PointCloud(this.particles, this.material);
  this.system.rotation.y = rotation;

  scene.add(this.system);

  this.transformation = new DepthTransformation(
    640 / reduce,
    480 / reduce,
    this.particles.vertices
  );

  var self = this;

  this.stream = new DepthStream(address, true, function(array) {
    self.transformation.update(array);
    self.particles.verticesNeedUpdate = true;
    self.onUpdate();
  });
}

/**
 * Stop renderer.
 */
DepthRender.prototype.stop = function(){
  this.stream.close();
};
