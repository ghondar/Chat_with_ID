var usuariosOnline = {};
var username;
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
		username = req.data;
		usuariosOnline[req.data] = username;
		req.io.emit("refreshChat", {
			informacion: "yo",
			mensaje: "El usuario " + username + " se ha conectado al chat."
		});
		req.io.broadcast("refreshChat", {
			informacion: "conectado",
			mensaje: "El usuario " + username + " se ha conectado al chat."
		});
		req.io.emit("updateSidebarUsers", usuariosOnline);
		req.io.broadcast("updateSidebarUsers", usuariosOnline);
	});
	server.io.route("addNewMessage", function (req){
		req.io.emit("refreshChat", {
			informacion: "msg",
			mensaje: "yo: "+ req.data
		});
		debugger;
		req.io.broadcast("refreshChat",{
			informacion: "msg",
			mensaje: username+" dice: "+req.data
		});		
	});
	server.io.route("disconnect", function (req){
		if(typeof(username)=="undefined"){
			return;
		}
		delete usuariosOnline[req.io.username];
		req.io.emit("updateSidebarUsers", usuariosOnline);
		req.io.broadcast("updateSidebarUsers", usuariosOnline);
		req.io.broadcast("refreshChat", {
			informacion: "desconectado",
			mensaje: "El usuario "+req.io.username+" se ha desconectado del chat."
		});
	});	
};

module.exports = chatController;