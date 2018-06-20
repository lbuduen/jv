const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/travel-asia-db';

module.exports = function () {
  let db = mongoose.connect(uri);

  require('../models/user.server.model');
  require('../models/accomodation.server.model');
  require('../models/activity.server.model');

  return db;
};
