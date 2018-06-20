const express = require('express');
const router = express.Router();

const users = require('../controllers/user.server.controller');
const accom = require('../controllers/accomodation.server.controller');
const app = require('../controllers/app.server.controller');
const activity = require('../controllers/activity.server.controller');
const transportation = require('../controllers/transportation.server.controller');

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

router.route('/totals').get(app.totalCounts);

//user routes
router.route('/users')
    .post(users.create)
    .get(users.list);
router.route('/users/login').post(users.login);
router.route('/users/:userId')
    .get(users.read)
    .delete(users.delete)
    .put(users.update);
router.param('userId', users.userById);

//accomodation routes
router.route('/accomodation')
    .post(accom.create)
    .get(accom.list);
router.route('/accomodation/contacts').get(accom.getContacts);
router.route('/accomodation/:accomId')
    .get(accom.read)
    .delete(accom.delete)
    .put(accom.update);
router.param('accomId', accom.accomById);

//activities routes
router.route('/activities')
    .post(activity.create)
    .get(activity.list);
router.route('/activities/contacts').get(activity.getContacts);
router.route('/activities/:actId')
    .get(activity.read)
    .delete(activity.delete)
    .put(activity.update);
router.param('actId', activity.activityById);

//transportation routes
// router.param('means', transportation.setTransportationMeans);
router.param('transId', transportation.transportationById);

router.route('/transportation/drivers').get(transportation.getDrivers);

router.route('/transportation/land')
    .post(transportation.create)
    .get(transportation.list);

router.route('/transportation/land/:transId')
    .get(transportation.read)
    .delete(transportation.delete)
    .put(transportation.update);



module.exports = router;