/**
 * Create a new Network.
 *
 * Events: 'found', 'lost', 'in', 'out'.
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
    var node = new Node(peer, self);

    node.on('ready', function(){
      self.nodes.push(node);
      self.emit('found', node);
    });
  });

  this.webrtc.on('peerStreamRemoved', function(peer){
    var node = peer.node;
    self.nodes.splice(self.nodes.indexOf(node), 1);
    self.emit('lost', node);
  });
};

/**
 * Send data to all nodes in a network.
 *
 * @param data
 */
Network.prototype.broadcast = function(data) {
  this.nodes.forEach(function(node){
    node.send(data);
  });
};

/**
 * Wrapper for a connected peer.
 *
 * Events 'ready', 'message'.
 *
 * @param peer
 * @param network
 * @constructor
 */
function Node(peer, network){
  var self = this;

  this.peer = peer;
  this.network = network;
  this.peer.node = this;

  this.peer.getDataChannel('data');

  this.peer.on('channelOpen', function(channel){
    if(channel.label == 'data') {
      var ready = !self.channel;
      self.channel = channel;

      channel.onmessage = function(event) {
        self.network.emit('in', event.data.length);
        self.emit('message', JSON.parse(event.data));
      };

      if(ready) {
        self.emit('ready');
      }
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
  var bytes = JSON.stringify(data);
  this.network.emit('out', bytes.length);
  this.channel.send(bytes);
};
