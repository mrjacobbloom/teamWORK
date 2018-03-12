const express = require('express');
const opn = require('opn');

const app = express();

app.use(express.static('resources'));

app.get('/', (req, res) => {
  res.sendFile('html/homepage.html', { root: __dirname });
});

app.get('/find', (req, res) => {
  res.sendFile('html/find.html', { root: __dirname });
});
app.get('/login', (req, res) => {
  res.sendFile('html/login.html', { root: __dirname });
});
app.get('/register', (req, res) => {
  res.sendFile('html/register.html', { root: __dirname });
});

app.listen(3000, () => {
  console.log('Running at http://localhost:3000/');
  opn('http://localhost:3000/');
});
