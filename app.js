var express = require("express"),
    app = express(),
    server = require('http').createServer(app),
    io = require("socket.io").listen(server);
    path =require("path");

server.listen(process.env.PORT || 5000);

app.get('/', function(req, res) {
   res.sendfile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname+'/estilo'));

var usuariosOnline = {};

io.sockets.on('connection',function(socket){
    socket.on("sendMessage",function(data){
        io.sockets.emit("newMessage",{msg: data});
    });
    socket.on('loginUser',function(username){
        if(usuariosOnline[username]){
            socket.emit("userInUse");
            return;
        }
        socket.username = username;
        usuariosOnline[username] = socket.username;
        socket.emit("refreshChat", "yo","Bienvenido "+ socket.username + ", te has conectado correctamente.");
        socket.broadcast.emit("refreshChat","conectado","El usuario "+socket.username+" se ha conectado al chat.");
        io.sockets.emit("updateSidebarUsers",usuariosOnline);
    });
    socket.on("addNewMessage",function(message){
        socket.emit("refreshChat","msg","yo: "+message);
        socket.broadcast.emit("refreshChat","msg",socket.username+ " dice: "+message);
    });
    socket.on("disconnect",function(){
        if(typeof(socket.username)=="undefined"){
            return;
        }
        delete usuariosOnline[socket.username];
        io.sockets.emit("updateSidebarUsers",usuariosOnline);
        socket.broadcast.emit("refreshChat","desconectado","El usuario "+socket.username+" se ha desconectado del chat.");
    });
});