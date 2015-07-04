/* Base Stuff */

var parameters = (function() {
	var parameters = {};
	var parts = window.location.search.substr(1).split('&');
	for (var i = 0; i < parts.length; i++) {
		var parameter = parts[i].split('=');
		parameters[parameter[0]] = parameter[1];
	}
	return parameters;
})();

/* Peer Stuff */

$(function(){
  var peer = new Peer(parameters.id, {key: ''});

  peer.on('open', function(id) {
    $('#peer-id').html(id);
    $('#connected').show();

    peer.on('connection', function(conn){
      console.log('new connection', conn);

      conn.on('data', function(data) {
        console.log('Received', data);
      });
    });

    $('#open').click(function(){
      var conn = peer.connect($('#peer').val());

      conn.on('open', function() {
        console.log('opened connection', conn);

        conn.send('Hello!');
      });
    });
  });
});
