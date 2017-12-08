var express = require('express');
var app = express();
const admin = require("firebase-admin");
var functions = require("firebase-functions");
var firebase = require('firebase')
app.use(express.static( __dirname + '/public'));
app.set('view engine', 'ejs');
var session=require('express-session');

app.use(session({
	secret:"secret",
	userid:"",
	status:0
}))

var sess ={};



firebase.initializeApp(config);
	admin.initializeApp(functions.config().firebase);
var db = admin.firestore();


app.get("/", function(req, res) {
    res.sendFile(__dirname+'/public/asn.html');
});

app.get("/asn1", function (req,res) {
	res.sendFile(__dirname+'/public/asn1.html');
	})


app.get("/signup",function (req,res) {
	var n = req.query.name,
	mail = req.query.email,
	un = req.query.Username,
	p = req.query.Password;
	var newObj = {
		name:n,
		email:mail,
		uname:un,
		pass:p
	}
	var insertDoc = db.collection('users').doc(un).set(newObj)
	.then(function(){
		console.log(newObj.name,'=>',newObj.uname);
		res.redirect('/asn1');
	})
	.catch(function(error){
		console.log(error)
	})

});

app.get('/signin',function (req,res) {
	var un = req.query.Username;
	p = req.query.password;

	var userRef = db.collection('users');
	var sin = userRef.where('uname','==',un).where('pass','==',p).get()
	.then(snapshot =>{
		snapshot.forEach(doc=> {
		console.log(doc.id,'=>',doc.data())
	})
		/*
		snapshot.forEach(doc=> {
		console.log(JSON.stringify(doc.data().uname));
		console.log(doc.id,'=>',doc.data())
		if(doc.data().uname == un && doc.data().pass == p){
			req.session.userid = doc.data().uname;
			console.log(req.session.userid);
			sess = {
				uid:(req.session.userid)
			}
			req.session.status = 1;
			req.session.cookie.expires = false;
			res.redirect('/homepage')
		*/	
		})
	.catch(err =>{
		console.log(err);
		res.redirect("/asn1")
	})

	})

app.get('/homepage',function (req,res) {
	console.log("working")
	//console.log(req.session.status)
	if (req.session.status == 0) {
		console.log("status 0")
		res.redirect('/asn1')
	}
	else{

	//	console.log(req.session.userid)
	//console.log(sess.userid);
		res.render("homepage.ejs",{res:sess})
	}
})

app.get('/logout',function (req,res) {
	
	req.session.destroy(function (err,data) {
		if(err){
			console.log(err)
		}
		else{
			res.redirect('/asn1')
		}
	})
})


exports.app = functions.https.onRequest(app);