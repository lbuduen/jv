const express = require('express');
const router = express.Router();

const users = require('../controllers/user.server.controller');

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

router.route('/users').post(users.create);
router.route('/users/login').post(users.login);

module.exports = router;