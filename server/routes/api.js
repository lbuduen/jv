const express = require('express');
const router = express.Router();

const users = require('../controllers/user.server.controller');
const accom = require('../controllers/accomodation.server.controller');

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

//user routes
router.route('/users').post(users.create);
router.route('/users/login').post(users.login);

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