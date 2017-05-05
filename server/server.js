const config = require('./config');
const port = config.port;

// Express
const express = require('express');
const path = require('path');

const app = express();
//app.engine('html');
//app.set('view engine', 'html');
app.use('/public', express.static(path.join('..', 'public')));

// Error Handlers
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({"message": err.name + ": " + err.message});
  }
});

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: 'public'});
});
app.get('/authorize/twitter', function(req, res) {
  res.sendFile('/authorize/twitter.html', {root: 'public'});
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
  console.log('http://' + config.url + ':' + port);
});