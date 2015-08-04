function PointCloud(vectors) {
  this.width = 640 / 4;
  this.height = 480 / 4;

  this.size = this.width * this.height;
  this.vectors = vectors;

  for(var y=0; y < this.height; y++) {
    for(var x=0; x < this.width; x++) {
      this.vectors.push(new THREE.Vector3(x, y, 0));
    }
  }
}

PointCloud.prototype.update = function(array){
  for(var y=0; y < this.height; y++) {
    for(var x=0; x < this.width; x++) {
      var index = y * this.width + x;
      var depth = array[index];
      this.vectors[index].set(x, y, depth / 100);
    }
  }
};
