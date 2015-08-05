/**
 * Create a new Network.
 *
 * Events: 'found', 'lost'.
 *
 * @param shareAudio
 * @constructor
 */
function Network(shareAudio) {
  this.shareAudio = shareAudio;

  this.nodes = [];

  SimpleEmitter.call(this);
}

Network.prototype = Object.create(SimpleEmitter.prototype);

/**
 * Connect to the network.
 */
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

Network.prototype.broadcast = function(data) {
  this.nodes.forEach(function(node){
    node.send(data);
  });
};

/**
 * Wrapper for a connected peer.
 *
 * @param peer
 * @constructor
 */
function Node(peer){
  var self = this;

  this.peer = peer;
  this.peer.node = this;

  this.channel = this.peer.getDataChannel('data');

  this.channel.onmessage = function(event) {
    self.emit('message', JSON.parse(event.data));
  };

  this.peer.on('channelOpen', function(channel){
    if(channel.label == 'data') {
      self.channel = channel;
      self.emit('ready');
    }
  });

  SimpleEmitter.call(this);
}

Node.prototype = Object.create(SimpleEmitter.prototype);

/**
 * Send data to peer.
 *
 * @param data
 */
Node.prototype.send = function(data) {
  this.channel.send(JSON.stringify(data));
};
