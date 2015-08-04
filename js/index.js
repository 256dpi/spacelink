$(function(){
  var n = new Network(false);

  n.on('found', function(peer){
    console.log('found:', peer);

    peer.on('ready', function(){
      peer.send({
        hello: 'world'
      });
    });

    peer.on('message', function(data){
      console.log('got:', data);
    });
  });

  n.on('lost', function(peer){
    console.log('lost:', peer);
  });

  n.connect();

  setInterval(function(){
    n.broadcast({
      ping: 'pong'
    })
  }, 1000);
});
