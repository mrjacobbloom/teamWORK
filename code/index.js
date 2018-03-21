const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
const nunjucks = require('nunjucks');
const opn = require('opn');

const DEVELOPMENT = true;

const app = express();

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
  req.session.user = {username: req.body.username_or_email};
  res.redirect('/');
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
