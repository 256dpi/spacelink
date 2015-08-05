/**
 * Create a DepthRender that draws and receives a depth image.
 *
 * @param stream
 * @param reduce
 * @param scene
 * @param rotation
 * @param onUpdate
 * @constructor
 */
function DepthRender(stream, reduce, scene, rotation, onUpdate) {
  var self = this;
  this.stream = stream;
  this.onUpdate = onUpdate;

  this.particles = new THREE.Geometry();

  this.material = new THREE.PointCloudMaterial({
    color: 0xFFFFFF,
    size: reduce / 2
  });

  this.system = new THREE.PointCloud(this.particles, this.material);
  this.system.rotation.y = rotation;

  scene.add(this.system);

  this.transformation = new DepthTransformation(reduce, this.particles.vertices);

  this.stream.on('data', function(array){
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
