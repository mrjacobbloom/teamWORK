const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const expressValidator = require('express-validator');
const nunjucks = require('nunjucks');
const opn = require('opn');


const DEVELOPMENT = true;
const app = express();

// SQL stuff lol
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var config = require('./config');
var dbOptions = {
 host: config.database.host,
 user: config.database.user,
 password: config.database.password,
 port: config.database.port,
 database: config.database.db
};
app.use(myConnection(mysql, dbOptions, 'pool'));

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: DEVELOPMENT
});

app.use(
     sassMiddleware({
         src: __dirname + '/sass', //where the sass files are 
         dest: __dirname + '/static', //where css should go
     })
 );
 
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'this-is-a-secret-token',
  cookie: {
    secure: false
  },
  resave: false,
  saveUninitialized: true
}));
app.use(expressValidator());

app.get('/', (req, res) => {
  if(req.session.user) {
    // create a new object as a shallow copy of the session object
    // but we want to attach more data to it
    let data = Object.assign({}, req.session);
    data.posts = [
      { name: 'Jennifer', location: 'Milwaukee', animal: 'cheese'},
      { name: 'Brandon S', location: 'Milwaukee', animal: 'cheese'},
      { name: 'Brandon G', location: 'a grocery store', animal: 'milk'},
    ];
    res.render('dashboard.njk', data);
  } else {
    res.render('landingpage.njk', req.session);
  }
});
app.get('/find', (req, res) => res.render('find.njk', req.session));
app.get('/user/:id', (req, res) => {
  let data = Object.assign({}, req.session);
  data.profile = {
    username: req.params.id
  };
  res.render('profile.njk', data);
});
app.get('/login', (req, res) => res.render('login.njk', req.session));
app.get('/register', (req, res) => res.render('register.njk', req.session));

/** SESSION STUFF **/
app.post('/login', function (req, res) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users WHERE username = "' + req.body.username + '"', function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
			} else {
				if(rows.length > 0) {
					let user = rows[0]
					if(user.password == req.body.password) { // username correct
						req.session.user = {username: req.body.username};
						res.redirect('/');
					} else { // username incorrect
						res.redirect('/login'); // TODO: add an error
					}
				} else { // there are no users with that username
					res.redirect('/login'); // TODO: add an error
				}
			}
		});
	});
});

app.post('/register', function (req, res) {
    console.log(req.body);
    //req.session.user = {username: req.body.username_or_email};
    
    req.assert('username', 'username is required').notEmpty();
    req.assert('password', 'password is required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(!errors) {
        var user = {
            username: req.sanitize('username').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            password: req.sanitize('password').escape().trim(),
            state: req.sanitize('state').escape().trim(),
            zipcode: req.sanitize('zipcode').escape().trim()
        };
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO users SET ?', user, function(err, result) {
                if (err) {
                    req.flash('error', err)
                } else {
                    // log them in here
                    res.redirect('/');
                }
            });
        });
    }
});
  
  
app.get('/logout', function (req, res) {
  req.session.user = null;
  res.redirect('/');
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running at http://localhost:${port}/`);
  if(port == 3000) opn(`http://localhost:${port}/`);
});
