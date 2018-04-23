const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const expressValidator = require('express-validator');
const nunjucks = require('nunjucks');
const opn = require('opn');
const utils = require('./server_resources/utils');


const DEVELOPMENT = true;
const app = express();

// SQL stuff lol
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var config = require('./server_resources/config');
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
    let data = utils.genContext(req);
    data.timeSince = utils.timeSince;
  	req.getConnection(function(error, conn) {
  		conn.query('SELECT * FROM data WHERE username = "' + req.session.user.username + '" ORDER BY post_date DESC', function(err, rows, fields) {
  			if (err) {
  				req.flash('error', err)
  			} else {
  				data.posts = rows;
  				res.render('journal.njk', data);
  			}
  		});
  	});	
    
  } else {
    res.render('landingpage.njk', utils.genContext(req));
  }
});
app.post('/', function (req, res) {
    req.assert('username', 'Username is required').notEmpty();
    req.assert('post_title', 'Post title is required').notEmpty();
    req.assert('post_desc', 'Post description is required').notEmpty();
    req.assert('latitude', 'Latitude is required').notEmpty();
    req.assert('longitude', 'Longitude is required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(!errors) {
        var post = {
            username: req.sanitize('username').escape().trim().toLowerCase(),
            post_title: req.sanitize('post_title').escape().trim(),
            post_desc: req.sanitize('post_desc').escape().trim(),
            latitude: req.sanitize('latitude').escape().trim(),
            longitude: req.sanitize('longitude').escape().trim(),
            post_date: utils.getCurrentDateString()
        };
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO data SET ?', post, function(err, result) {
                if (err) {
                    res.redirect(utils.passErrors('/', err));
                } else {
                    res.redirect('/');
                }
            });
        });
    } else {
      res.redirect(utils.passErrors('/', errors));
    }
});

app.get('/about', (req, res) => res.render('about.njk', utils.genContext(req)));

app.get('/user/:id', (req, res) => {
  let data = Object.assign({}, utils.genContext(req));
  data.profile = {
    username: req.params.id
  };
  res.render('profile.njk', data);
});
app.get('/login', (req, res) => res.render('login.njk', utils.genContext(req)));
app.get('/register', (req, res) => res.render('register.njk', utils.genContext(req)));

/** SESSION STUFF **/
app.post('/login', function (req, res) {
	req.getConnection(function(error, conn) {
		let username = req.body.username.toLowerCase();
		conn.query('SELECT * FROM users WHERE username = "' + username + '"', function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
			} else {
				if(rows.length > 0) {
					let user = rows[0]
					if(user.password == req.body.password) { // username correct
						req.session.user = {username: username};
						res.redirect('/');
					} else { // username incorrect
						res.redirect(utils.passErrors('/login', "Password incorrect"));
					}
				} else { // there are no users with that username
					res.redirect(utils.passErrors('/login', "Username not found"));
				}
			}
		});
	});
});

app.post('/register', function (req, res) {    
    req.assert('username', 'Username is required').notEmpty();
    req.assert('password', 'Password is required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(!errors) {
        var user = {
            username: req.sanitize('username').escape().trim().toLowerCase(),
            email: req.sanitize('email').escape().trim(),
            password: req.sanitize('password').escape().trim(),
            state: req.sanitize('state').escape().trim(),
            zipcode: req.sanitize('zipcode').escape().trim()
        };
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO users SET ?', user, function(err, result) {
                if (err) {
                    res.redirect(utils.passErrors('/register', err));
                } else {
                    res.redirect('/login');
                }
            });
        });
    } else {
      res.redirect(utils.passErrors('/register', errors));
    }
});
  
  
app.get('/logout', function (req, res) {
  req.session.user = null;
  res.redirect('/');
});

app.get('*', (req, res) => res.render('404.njk', utils.genContext(req)));

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running at http://localhost:${port}/`);
  if(port == 3000) opn(`http://localhost:${port}/`);
});
