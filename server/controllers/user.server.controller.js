const User = require('mongoose').model('User');

exports.create = function (req, res, next) {
    const user = new User(req.body);

    user.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            res.status(201).end();
        }
    });
}

exports.login = function (req, res) {
    User.findOne({ "email": req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (user && user.authenticate(req.body.password)) {
                res.status(200).json(user);
            }
            else {
                return res.status(401).send({
                    message: 'Invalid credentials'
                });
            }
        }
    });
};

function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message)
                return err.errors[errName].message;
        }
    }
    else {
        return 'Unknown server error';
    }
};