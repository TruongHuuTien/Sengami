var	app		= require('express')();
var	server	= require('http').createServer(app);
var	io		= require('socket.io').listen(server, {'log level':2});
var	request	= require('request');
var colors	= require('colors');
var	port	= 8080;

var userRegistry	= require('userRegistry').create();
	
server.listen(port);
console.log("Start Sengami's Server on port: ".blue+port.toString().magenta);

app.get('/', function(req, res){
	res.sendfile(__dirname+'/home.html');
});
app.get('/ressource/:file', function(req, res){
	res.sendfile(__dirname+'/ressource/'+req.params.file);
});
app.get('/js/:file', function(req, res){
	res.sendfile(__dirname+'/js/'+req.params.file);
});

io.sockets.on('connection', function(socket){

	socket.on('user_init', function(res) {
		user = {
			name	: res,
			id		: socket.id
		}
		if (userRegistry.insert(user)) {
			console.log('userRegistry'.cyan, 'insert'.red, user);
		}
	});
	
	socket.on('msg', function(res) {
		if (user = userRegistry.getByName(res.name)) {
			io.sockets.socket(user.id).emit('msg', res.msg);
		}
	});
	
	socket.on('move', function(res) {
		if (user = userRegistry.getByName(res.name)) {
			io.sockets.emit('move', {
				username	: user.name,
				x		: res.x,
				y		: res.y,
				color	: res.color
			});
		}
	});

	socket.on('disconnect', function(res){
		userRegistry.remove(socket.id);
	});
});


