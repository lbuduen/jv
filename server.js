process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const db = require('./server/config/mongoose')();

const path = require('path');
const fs = require('fs');
const http = require('http');

const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const fileUpload = require('express-fileupload');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
else if (process.env.NODE_ENV === 'production') {
  app.use(compress());
}
app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride());

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'config.sessionSecret'
}));

app.use(express.static(path.join(__dirname, 'dist/blank')));

const api = require('./server/routes/api');
app.use('/api', api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/blank/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));

module.exports = app;