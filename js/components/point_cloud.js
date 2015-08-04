/*
  Calculations: http://stackoverflow.com/questions/17832238/kinect-intrinsic-parameters-from-field-of-view/18199938#18199938
 */

function PointCloud(vectors) {
  this.width = 640 / 4;
  this.height = 480 / 4;

  this.size = this.width * this.height;
  this.vectors = vectors;

  this.f = this.height / (2 * Math.tan(43 / 2)); // 43°

  for(var y=0; y < this.height; y++) {
    for(var x=0; x < this.width; x++) {
      this.vectors.push(new THREE.Vector3(0, 0, 0));
    }
  }
}

PointCloud.prototype.update = function(array){
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
