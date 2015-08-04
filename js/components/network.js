function Network(shareAudio) {
  this.shareAudio = shareAudio;

  this.nodes = [];
  this.callbacks = {};
}

Network.prototype.on = function(event, callback) {
  this.callbacks[event] = callback;
};

Network.prototype.emit = function(event, data) {
  var cb = this.callbacks[event];
  if(cb) cb(data);
};

Network.prototype.connect = function(){
  var self = this;

  this.webrtc = new SimpleWebRTC({
    //debug: true,
    media: {
      video: false,
      audio: this.shareAudio
    },
    autoRequestMedia: this.shareAudio
  });

  this.webrtc.joinRoom('256dpi/spacelink');

  this.webrtc.on('createdPeer', function(peer) {
    var node = new Node(peer);
    self.nodes.push(node);
    self.emit('found', node);
  });

  this.webrtc.on('peerStreamRemoved', function(peer){
    var node = peer.node;
    self.nodes.splice(self.nodes.indexOf(node), 1);
    self.emit('lost', node);
  });
};

function Node(peer){
  this.peer = peer;
  this.peer.node = this;
}
