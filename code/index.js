const express = require('express');
const opn = require('opn');

const app = express();

app.get(/\/resources\/\w+\.\w+/, (req, res) => {
  console.log('request for ' + req.originalUrl)
  res.sendFile(req.originalUrl, { root: __dirname });
});
app.get('/', (req, res) => {
  res.sendFile('html/homepage.html', { root: __dirname });
});

app.get('/find', (req, res) => {
  res.sendFile('html/find.html', { root: __dirname });
});

app.listen(3000, () => {
  console.log('Running at http://localhost:3000/');
  opn('http://localhost:3000/');
});
