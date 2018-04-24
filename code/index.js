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
app.use(myConnection(mysql, process.env.JAWSDB_URL || dbOptions, 'pool'));

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
  let data = utils.genContext(req);
  data.timeSince = utils.timeSince;
	req.getConnection(function(error, conn) {
		conn.query(utils.postQuery(), function(err, rows, fields) {
			if (err) {
        data.posts = [];
        data.errors = [err];
				res.render('journal.njk', data);
			} else {
				data.posts = rows;
        data.dummy = {
          username: 'your name here',
          post_title: 'I saw a squirrel!',
          post_desc: 'It had a super bushy tail and no financial worries!',
          latitude: 40.689254,
          longitude: -74.0445,
          post_date: new Date()
        }
				res.render('journal.njk', data);
			}
		});
	});	
});
app.post('/', function (req, res) {
    req.assert('post_title', 'Post title is required').notEmpty();
    req.assert('post_desc', 'Post description is required').notEmpty();
    req.assert('latitude', 'Latitude is required').notEmpty();
    req.assert('longitude', 'Longitude is required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(!errors) {
        var post = {
            username: req.session.user.username,
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
  let data = utils.genContext(req);
  let username = expressValidator.validator.escape(req.params.id);
  req.getConnection(function(error, conn) {
    conn.query('SELECT * FROM users WHERE username = "' + username + '" LIMIT 1', function(err, rows, fields) {
        if (err) {
          res.redirect(utils.passErrors('/', err));
        } else {
          if(rows.length) {
            conn.query(utils.postQuery(username), function(err, rows, fields) {
              if (err) {
                res.redirect(utils.passErrors('/', err));
              } else {
                data.profile = {username: username};
                data.posts = rows;
                data.timeSince = utils.timeSince;
                res.render('profile.njk', data);
              }
            });
          } else {
            res.render('404.njk', data);
          }
        }
      });
  });
});
app.get('/login', (req, res) => res.render('login.njk', utils.genContext(req)));
app.get('/register', (req, res) => res.render('register.njk', utils.genContext(req)));

/** SESSION STUFF **/
app.post('/login', function (req, res) {
	req.getConnection(function(error, conn) {
		let username = req.body.username.toLowerCase();
		conn.query('SELECT * FROM users WHERE username = "' + username + '" LIMIT 1', function(err, rows, fields) {
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
    req.assert('email', 'Email is required').notEmpty();
    req.assert('state', 'State is required').notEmpty();
    req.assert('zipcode', 'Zip code is required').notEmpty();
    
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
          conn.query('SELECT * FROM users WHERE username = "' + user.username + '" LIMIT 1', function(err, rows, fields) {
              if (err) {
                res.redirect(utils.passErrors('/register', err));
              } else {
                if(rows.length) {
                  res.redirect(utils.passErrors('/register', `The username "${user.username}" is not available`));
                } else {
                  conn.query('INSERT INTO users SET ?', user, function(err, result) {
                    if (err) {
                      res.redirect(utils.passErrors('/register', err));
                    } else {
                      req.session.user = {username: user.username};
                      res.redirect('/');
                    }
                  });
                }
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
