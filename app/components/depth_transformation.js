/**
 * Create a new DepthTransformation with a target vector array.
 *
 * Calculations:
 * http://stackoverflow.com/questions/17832238/kinect-intrinsic-parameters-from-field-of-view/18199938#18199938
 *
 * @param width
 * @param height
 * @param geometry
 * @constructor
 */
function DepthTransformation(width, height, geometry) {
  this.width = width;
  this.height = height;
  this.size = this.width * this.height;
  this.positions = geometry.attributes.position;
  this.colors = geometry.attributes.color;

  // focal length: 43°
  this.f = this.height / (2 * Math.tan(43 / 2));

  var n;
  for(var y=0; y < this.height; y++) {
    for(var x=0; x < this.width; x++) {
      n = (y * this.width + x) * 3;

      this.positions.array[n] = 0;
      this.positions.array[n + 1] = 0;
      this.positions.array[n + 2] = 0;

      this.colors.array[n] = 1;
      this.colors.array[n + 1] = 1;
      this.colors.array[n + 2] = 1;
    }
  }

  this.positions.needsUpdate = true;
  this.colors.needsUpdate = true;
}

/**
 * Update vectors with depth data.
 *
 * @param depth
 * * @param color
 */
DepthTransformation.prototype.update = function(depth, color){
  var index, zw, xw, yw;
  for(var y=0; y < this.height; y++) {
    for(var x=0; x < this.width; x++) {
      index = y * this.width + x;

      zw = depth[index];
      xw = zw * (x - this.width / 2) / this.f;
      yw = zw * (y - this.height / 2) / this.f;

      // convert units from mm to cm
      this.positions.array[index * 3] = xw / 10;
      this.positions.array[index * 3 + 1] = yw / 10;
      this.positions.array[index * 3 + 2] = zw / 10;

      this.colors.array[index * 3] = color[index * 3] / 255;
      this.colors.array[index * 3 + 1] = color[index * 3 + 1] / 255;
      this.colors.array[index * 3 + 2] = color[index * 3 + 2] / 255;
    }
  }

  this.positions.needsUpdate = true;
  this.colors.needsUpdate = true;
};

module.exports = DepthTransformation;
