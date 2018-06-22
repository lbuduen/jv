const express = require('express');
const morgan = require('morgan');
const compress = require('compression');

const app = express();

app.use(compress());
app.use(morgan('dev'));

app.use(express.static('assets'));

app.listen(3001, function () {
    console.log('Media server running in 3001!');
});