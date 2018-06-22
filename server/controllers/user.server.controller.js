const fs = require('fs');

const User = require('mongoose').model('User');

const dir = './assets/img/user';

exports.create = function (req, res, next) {
    const user = new User(req.body);

    user.save((err, usr) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (req.files) {
                const updir = `${dir}/${usr._id}`;
                fs.mkdirSync(updir);

                let photo = req.files.photo;
                photo.mv(`${updir}/${photo.name}`, function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
                savePhotosDB(usr, photo.name);
            }
            res.status(201).end();
        }
    });
}

function savePhotosDB(user, photo) {
    user.photo = photo;
    user.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
}

exports.list = function (req, res, next) {
    User.find((err, users) => {
        if (err) {
            return next(err);
        }
        else {
            res.status(200).json(users);
        }
    });
};

exports.delete = function (req, res) {
    const user = req.user;
    user.remove(err => {
        if (err) {
            return next(err);
        }
        const updir = `${dir}/${user._id}`;

        fs.unlinkSync(`${updir}/${photo}`);

        fs.rmdir(updir, (err) => {
            if (err) {
                return next(err);
            }
        });
        res.status(200).json(user);
    })
};

exports.userById = function (req, res, next, id) {
    User.findById(id, '-password -salt', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('Failed to load user ' + id));
        }

        req.user = user;
        next();
    });
};

exports.read = function (req, res) {
    res.status(200).json(req.user);
};

exports.update = function (req, res) {
    const user = req.user;

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.role = req.body.role;
    user.password = req.body.password;

    user.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (req.files) {
                const updir = `${dir}/${user._id}`;

                try {
                    fs.accessSync(updir, fs.constants.R_OK);
                } catch (err) {
                    fs.mkdirSync(updir);
                }

                let photo = req.files.photo;
                photo.mv(`${updir}/${photo.name}`, function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
                savePhotosDB(user, photo.name);
            }
            res.status(204).end();
        }
    });
};


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