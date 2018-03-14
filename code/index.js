const express = require('express');
const nunjucks = require('nunjucks');
const opn = require('opn');

const DEVELOPMENT = true;

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: DEVELOPMENT
});
app.use(express.static('static'));

app.get('/', (req, res) => res.render('homepage.njk'));
app.get('/find', (req, res) => res.render('find.njk'));
app.get('/login', (req, res) => res.render('login.njk'));
app.get('/register', (req, res) => res.render('register.njk'));

app.listen(3000, () => {
  console.log('Running at http://localhost:3000/');
  opn('http://localhost:3000/');
});
