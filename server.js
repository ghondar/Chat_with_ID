var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var PUERTO = process.env.PORT || 3000,
	IP = process.env.IP || "localhost";

server.listen(PUERTO, IP);

app.set('views',"./app/views");
app.set('view engine', 'jade');

app.use(express.static("./public"));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({secret: "ghondar"}));

//Controladores

var chatController = require('./app/controllers/chat');
chatController(app, io);

console.log("Servidor se contecto al puerto "+ PUERTO);
