var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var session = require('express-session');



var arr = {};
var user = "";
app.set('view engine', 'ejs');

app.use(bodyParser());
app.use(cookieParser());
app.use(session({ secret : "TSS"}));

app.get('/', function(req, res){
	res.render("home");
});

app.post('/', function(req, res){
	user = req.body.name;
	req.session.name=user;
	res.redirect('chat');
});

function check_sess(req, res, next){
	if(! req.session.name){
		res.redirect("/");
		return;
	}
	next();
}

app.get('/chat', check_sess, function(req, res){
	user=req.session.name;
	res.render("chat");
});





	io.on('connection', function(socket){
		
		// console.log(socket.id);
		arr[user]=socket.id;
		console.log(arr);
		socket.emit("sendername", { name : user});


		
		io.emit("online", { arr : arr, loggeinuser : user });

		socket.on('msg', function(data){
			console.log(data);

			io.to(arr[data.recname]).emit('message', { sender : data.sendername, msg : data.msg });
			
		});

	});



http.listen(3000, function(){
	console.log("Running");
});
