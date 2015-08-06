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

  this.particles = new THREE.Geometry();

  this.material = new THREE.PointCloudMaterial({
    color: 0xFFFFFF,
    size: reduce / 2
  });

  this.system = new THREE.PointCloud(this.particles, this.material);
  this.system.rotation.y = rotation;

  this.renderEngine.scene.add(this.system);

  this.transformation = new DepthTransformation(reduce, this.particles.vertices);

  this.stream.on('data', function(data){
    var array = new Uint16Array(data);
    self.transformation.update(array);
    self.particles.verticesNeedUpdate = true;
    self.renderEngine.render();
  });
}

/**
 * Stop renderer.
 */
DepthRender.prototype.stop = function(){
  this.scene.remove(this.system);
};
