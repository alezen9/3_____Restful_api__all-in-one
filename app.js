var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var fs = require('fs');


var file_a;
var exists = fs.existsSync('data.json');
if (exists) {
  // Read the file
  console.log('loading database');
  var txt = fs.readFileSync('data.json', 'utf8');
  // Parse it  back to object
  file_a = JSON.parse(txt);
} else {
  // Otherwise start with blank list
  console.log('empty database');
  file_a = {
			"users": [],
			  "id": 0
			};
}

//returns all users in database
app.get('/all',function(req,res){
	var reply = file_a.users;
	console.log(JSON.stringify(reply, null, 2));
	res.send(reply);
});

//create new user (funzionante)

app.post('/',function(req,res){
	var utente_name = req.body.name;
	var utente_email = req.body.email;
	var utente_password = req.body.password;
	file_a.id = file_a.id +1;
	file_a.users.push({
		name: utente_name,
		email: utente_email,
		password: utente_password,
		id: file_a.id
	})
	// update json
	fs.writeFile('./data.json', JSON.stringify(file_a, null, 2), 'utf-8', function(err) {
		if (err) throw err;
		console.log('Succesfully added user ' + utente_name);
	})

	var reply = {
		status: 'successfully added',
		name: utente_name,
		email: utente_email,
		password: utente_password,
		id: file_a.id
	  }
	res.status(200).send(reply);
});


//gets single user from database
app.get('/:id',function(req,res){
	var reply;
	var id = Number(req.params.id);
	var index = file_a.users.findIndex(function(item, i){
	  return item.id=== id;
	});
	if(index<0){
		reply = 'user not found';
		console.log(reply);
	}
	else{
		reply = file_a.users[index];
		console.log(JSON.stringify(reply, null, 2));
	}
	res.send(reply);
});

//delete user from database
app.delete('/:id',function(req,res){
	var reply;
	var id = Number(req.params.id);
	var index = file_a.users.findIndex(function(item, i){
	  return item.id=== id;
	});
	if(index<0){
		reply = 'user not found';
		console.log(reply);
	}
	else{
		reply = {
			status: 'successfully deleted',
			name: file_a.users[index].name,
			email: file_a.users[index].email,
			password: file_a.users[index].password,
			id: file_a.users[index].id
		  }
		  var utente_nome = file_a.users[index].name;
		file_a.users.splice(index,1);
		fs.writeFile('./data.json', JSON.stringify(file_a, null, 2), 'utf-8', function(err) {
			if (err) throw err;
			console.log('Succesfully deleted user ' + utente_nome);
		})
		console.log(JSON.stringify(reply, null, 2));
	}
	res.send(reply);
});

//update single user in database
app.put('/:id',function(req,res){
	var reply;
	var id = Number(req.params.id);
	var utente_name;
	var utente_email;
	var utente_password;
	var index = file_a.users.findIndex(function(item, i){
		return item.id=== id;
	});
	if(index<0){
		 reply = 'user not found';
		console.log(reply);
	}
	else{
		if(!req.body.name){
			utente_name = file_a.users[index].name;
		}
		else{
			utente_name = req.body.name;
		}
		if(!req.body.password){
			utente_password = file_a.users[index].password;
		}
		else{
			utente_password = req.body.password;
		}
		if(!req.body.email){
			utente_email = file_a.users[index].email;
		}
		else{
			utente_email = req.body.email;
		}
		file_a.users[index].name = utente_name;
		file_a.users[index].password = utente_password;
		file_a.users[index].email = utente_email;
		reply = {
			status: 'successfully updated',
			name: utente_name,
			email: utente_email,
			password: utente_password,
			id: file_a.users[index].id
		}
		// update json
		fs.writeFile('./data.json', JSON.stringify(file_a, null, 2), 'utf-8', function(err) {
			if (err) throw err;
			console.log('Succesfully updated user ' + utente_name);
		})
	}
	console.log(JSON.stringify(reply, null, 2));
	res.send(reply);
});


// to make it visible to the rest of the programm
module.exports = app;