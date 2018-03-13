const express = require('express');
const expressNunjucks = require('express-nunjucks');
const opn = require('opn');

const DEVELOPMENT = true;

const app = express();

app.set('views', __dirname + '/html');
const njk = expressNunjucks(app, {
    watch: DEVELOPMENT,
    noCache: DEVELOPMENT
});

app.use(express.static('static'));

app.get('/', (req, res) => res.render('homepage'));
app.get('/find', (req, res) => res.render('find'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));

app.listen(3000, () => {
  console.log('Running at http://localhost:3000/');
  opn('http://localhost:3000/');
});
