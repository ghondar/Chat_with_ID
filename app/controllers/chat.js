var usuariosOnline = {};
var usuario;
var chatController = function (app, io){
	app.get('/', function (req, res){
		res.render('chat');
	});	
	io.sockets.on('connection', function (socket){
		socket.on('sendMessage', function (data){
			io.sockets.emit('newMessage',{msg: data});
		});
		socket.on('loginUser', function (username){
			if(usuariosOnline[username]){
				socket.emit("userInUse");
				return;
			}
			socket.username = username;
			usuariosOnline[username] = socket.username;		
			socket.emit("refreshChat", {
				informacion: "yo",
				mensaje: "El usuario " + socket.username + " se ha conectado al chat."
			});
			socket.broadcast.emit("refreshChat", {
				informacion: "conectado",
				mensaje: "El usuario " + socket.username + " se ha conectado al chat."
			});
			io.sockets.emit("updateSidebarUsers", usuariosOnline);
		});
		socket.on("addNewMessage", function (message){
			socket.emit("refreshChat", {
				informacion: "msg",
				mensaje: "yo: "+ message
			});
			debugger;		
			socket.broadcast.emit("refreshChat",{
				informacion: "msg",
				mensaje: socket.username+" dice: "+req.data
			});		
		});
		socket.on("disconnect", function (){	
			debugger;	
			if(typeof(socket.username)=="undefined"){
				return;
			}		
			delete usuariosOnline[socket.username];
			io.sockets.emit("updateSidebarUsers", usuariosOnline);
			socket.broadcast.emit("refreshChat", {
				informacion: "desconectado",
				mensaje: "El usuario "+socket.username+" se ha desconectado del chat."
			});
		});	
	});
};

module.exports = chatController;