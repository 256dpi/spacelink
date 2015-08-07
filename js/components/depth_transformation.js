/**
 * Create a new DepthTransformation with a target vector array.
 *
 * Calculations:
 * http://stackoverflow.com/questions/17832238/kinect-intrinsic-parameters-from-field-of-view/18199938#18199938
 *
 * @param reduce
 * @param geometry
 * @constructor
 */
function DepthTransformation(reduce, geometry) {
  this.width = 640 / reduce;
  this.height = 480 / reduce;

  this.size = this.width * this.height;
  this.geometry = geometry;
  this.attr = this.geometry.attributes.position;

  // focal length: 43°
  this.f = this.height / (2 * Math.tan(43 / 2));

  var n;
  for(var y=0; y < this.height; y++) {
    for(var x=0; x < this.width; x++) {
      n = (y * this.width + x) * 3;
      this.attr.array[n] = 0;
      this.attr.array[n + 1] = 0;
      this.attr.array[n + 2] = 0;
    }
  }

  this.attr.needsUpdate = true;
}

/**
 * Update vectors with depth data.
 *
 * @param array
 */
DepthTransformation.prototype.update = function(array){
  var index, zw, xw, yw;
  for(var y=0; y < this.height; y++) {
    for(var x=0; x < this.width; x++) {
      index = y * this.width + x;

      zw = array[index];
      xw = zw * (x - this.width / 2) / this.f;
      yw = zw * (y - this.height) / this.f;

      this.attr.array[index * 3] = xw / 10;
      this.attr.array[index * 3 + 1] = yw / 10;
      this.attr.array[index * 3 + 2] = zw / 10;
    }
  }

  this.attr.needsUpdate = true;
};
