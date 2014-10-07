var usuariosOnline = {};
var chatController = function (server){
	server.get('/', function (req, res){
		res.render('chat');
	});

	server.io.route('sendMessage', function (req){
		req.io.emit('newMessage',{msg: req.data});
	});
	server.io.route('loginUser', function (req){
		if(usuariosOnline[req.data]){
			req.io.emit("userInUse");
			return;
		}
		req.io.username = req.data;
		usuariosOnline[req.data] = req.io.username;
		req.io.emit("refreshChat", {
			informacion: "yo",
			mensaje: "El usuario " + req.io.username + " se ha conectado al chat."
		});
		req.io.broadcast("refreshChat", {
			informacion: "conectado",
			mensaje: "El usuario " + req.io.username + " se ha conectado al chat."
		});
		req.io.emit("updateSidebarUsers", usuariosOnline);
		req.io.broadcast("newUser",{
			usuario: req.io.username
		});
	});
	server.io.route("addNewMessage", function (req){
		req.io.emit("refreshChat", {
			informacion: "msg",
			mensaje: "yo: "+ req.data
		});
		req.io.broadcast("refreshChat",{
			informacion: "msg",
			mensaje: req.io.username+" dice: "+req.data
		});		
	});
	server.io.route("disconnect", function (req){
		if(typeof(req.io.username)=="undefined"){
			return;
		}
		delete usuariosOnline[req.io.username];
		req.io.emit("updateSidebarUsers", usuariosOnline);
		req.io.broadcast("refreshChat", {
			informacion: "desconectado",
			mensaje: "El usuario "+req.io.username+" se ha desconectado del chat."
		});
	});	
};

module.exports = chatController;