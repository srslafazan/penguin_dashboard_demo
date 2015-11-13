// DEPENDENCIES
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  path = require('path'),
  mongoose = require('mongoose');


// CONFIG  
app.use(express.static(path.join(__dirname + "/static")));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


// MODELS
mongoose.connect('mongodb://localhost/penguin_dashboard');

var PenguinSchema = new mongoose.Schema({
 	name: String,
 	color: String,
 	tail: String
});
var Penguin = mongoose.model('Penguin', PenguinSchema);


// ROUTING
app.get('/penguins/:id/destroy', function (request, response){
	console.log(request.params.id);

	Penguin.remove({ _id: request.params.id }, function (err, penguin_was_destroyed ){
		if(err){
			console.log('handle that err!');
			console.log(err);
			response.end(err);
		} else {
			console.log(penguin_was_destroyed);
			response.redirect('/');
		}
	});
}); // destroys mongoose

app.get('/', function (request, response){
	Penguin.find(function (err, penguins_from_mongodb){
		if(err){
			console.log(err);
			response.end(err);
		} else {
			console.log(penguins_from_mongodb);
		  response.render('index', {penguins: penguins_from_mongodb});
		}
	});
}); // displays all moongooses

app.get('/penguins/new', function (request, response){
	response.render('new');
}); // displays form to add a mongoose
app.get('/penguins/:id/edit', function (request, response){
	console.log(request.params.id);
	// query mongoose from db
	Penguin.findOne({ _id: request.params.id }, function (err, penguin_from_mongodb){
		if(err){
			console.log('handle that err!');
			console.log(err);
			response.end(err);
		} else {
			console.log(penguin_from_mongodb);
			response.render('edit', { penguin: penguin_from_mongodb }); // pass mongoose
		}
	});
}); // displays form to edit a mongoose

app.post('/penguins/:id/update', function (request, response){
	console.log(request.body);

	Penguin.update({_id: request.params.id }, request.body, function (err){
		if(err) {
			console.log('we sad :(');
			response.end(request.body);
		} else {
			console.log('updated penguin');
			response.redirect('/');	
		}
	} );

});

app.get('/penguins/:id', function (request, response){
	
	console.log(request.params.id);
	// query mongoose from db
	Penguin.findOne({ _id: request.params.id }, function (err, penguin_from_mongodb){
		if(err){
			console.log('handle that err!');
			console.log(err);
			response.end(err);
		} else {
			console.log(penguin_from_mongodb);
			response.render('show', { penguin: penguin_from_mongodb }); // pass mongoose
		}
	});
}); // displays a single mongoose

app.post('/penguins', function (request, response){
	var new_penguin = new Penguin(request.body);
	new_penguin.save(function (err){
		if(err) {
			console.log('handle that err');
			console.log(err);
			response.end(err);
		} else {
			console.log('successfully added mongoose, bro!');
			response.redirect('/');
		}
	});
}); // creates a new mongoose


// SERVER
var server = app.listen(8000, function(){
  console.log('listening on 8000');
});