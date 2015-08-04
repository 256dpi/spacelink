$(function(){
  var n = new Network(false);

  n.on('found', function(peer){
    console.log('found:', peer);
  });

  n.on('lost', function(peer){
    console.log('lost:', peer);
  });

  n.connect();
});
