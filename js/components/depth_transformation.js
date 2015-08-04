/**
 * Create a new DepthTransformation with a target vector array.
 *
 * Calculations:
 * http://stackoverflow.com/questions/17832238/kinect-intrinsic-parameters-from-field-of-view/18199938#18199938
 *
 * @param width
 * @param height
 * @param vectors
 * @constructor
 */
function DepthTransformation(width, height, vectors) {
  this.width = width;
  this.height = height;

  this.size = this.width * this.height;
  this.vectors = vectors;

  // focal length: 43°
  this.f = this.height / (2 * Math.tan(43 / 2));

  for(var y=0; y < this.height; y++) {
    for(var x=0; x < this.width; x++) {
      this.vectors.push(new THREE.Vector3(0, 0, 0));
    }
  }
}

/**
 * Update vectors with depth data.
 *
 * @param array
 */
DepthTransformation.prototype.update = function(array){
  for(var y=0; y < this.height; y++) {
    for(var x=0; x < this.width; x++) {
      var index = y * this.width + x;

      var zw = array[index];
      var xw = zw * (x - this.width / 2) / this.f;
      var yw = zw * (y - this.height / 2) / this.f;

      this.vectors[index].set(xw / 10, yw / 10, zw / 10);
    }
  }
};
