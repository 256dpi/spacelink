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

  this.particles = new THREE.PlaneBufferGeometry(640, 480, 640 / reduce - 1, 480 / reduce - 1);

  this.system = new THREE.Mesh(this.particles, new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  }));

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
