const express = require('express');
const router = express.Router();

const users = require('../controllers/user.server.controller');
const accom = require('../controllers/accomodation.server.controller');
const app = require('../controllers/app.server.controller');

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

router.route('/totals').get(app.totalCounts);

//user routes
router.route('/users')
    .post(users.create)
    .get(users.list);
router.route('/users/:userId')
    .get(users.read)
    .delete(users.delete)
    .put(users.update);
router.route('/users/login').post(users.login);
router.param('userId', users.userById);

//accomodation routes
router.route('/accomodation')
    .post(accom.create)
    .get(accom.list);
router.route('/accomodation/:accomId')
    .get(accom.read)
    .delete(accom.delete)
    .put(accom.update);
router.param('accomId', accom.accomById);
module.exports = router;