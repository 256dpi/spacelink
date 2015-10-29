var SimpleEmitter = require('./simple_emitter');

/**
 * Create a new Network.
 *
 * Events: 'found', 'lost', 'in', 'out'.
 *
 * @constructor
 */
function Network(configManager) {
  this.configManager = configManager;
  this.nodes = [];
  this.speaking = false;

  SimpleEmitter.call(this);
}

Network.prototype = Object.create(SimpleEmitter.prototype);

/**
 * Connect to the network.
 */
Network.prototype.connect = function(){
  var self = this;

  this.webrtc = new SimpleWebRTC({
    media: {
      video: false,
      audio: true
    },
    autoRequestMedia: false // true
  });

  this.configManager.on('mute', function(yes){
    yes ? self.webrtc.mute() : self.webrtc.unmute();
  });

  this.webrtc.on('readyToCall', function () {
    self.webrtc.joinRoom('256dpi/spacelink');
  });

  this.webrtc.on('speaking', function(){
    self.speaking = true;
  });

  this.webrtc.on('stoppedSpeaking', function(){
    self.speaking = false;
  });

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
        //self.emit('message', JSON.parse(event.data));
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

module.exports = Network;
