var express = require('express.io');

var server = express();
server.http().io();

var PUERTO = process.env.PORT || 3000,
	IP = process.env.IP || "localhost";

server.set('views',"./app/views");
server.set('view engine', 'jade');

server.use(express.static("./public"));

server.use(express.cookieParser());
server.use(express.bodyParser());

//Controladores

var chatController = require('./app/controllers/chat');
chatController(server);

server.listen(PUERTO, IP);

console.log("Servidor se contecto al puerto "+ PUERTO);
