const Activity = require('mongoose').model('Activity');
const User = require('mongoose').model('User');

const fs = require('fs');

const dir = './assets/img/activities';

exports.create = function (req, res, next) {
    const act = new Activity(req.body);

    act.save((err, activity) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (req.files) {
                const updir = `${dir}/${activity._id}`;
                fs.mkdirSync(updir);

                let photos = [];
                if (Array.isArray(req.files.photos)) {
                    req.files.photos.forEach(photo => {
                        photo.mv(`${updir}/${photo.name}`, function (err) {
                            if (err) {
                                return res.status(500).send(err);
                            }
                        });
                        photos.push(photo.name);
                    });
                }
                else {
                    let photo = req.files.photos;
                    photo.mv(`${updir}/${photo.name}`, function (err) {
                        if (err) {
                            return res.status(500).send(err);
                        }
                    });
                    photos.push(photo.name);
                }
                savePhotosDB(activity, photos);
            }
            res.status(201).end();
        }
    });
};

function savePhotosDB(activity, photos) {
    activity.photos = photos;
    activity.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
}

exports.list = function (req, res, next) {
    Activity.find((err, activities) => {
        if (err) {
            return next(err);
        }
        else {
            res.status(200).json(activities);
        }
    });
};

exports.activityById = function (req, res, next, id) {
    Activity.findById(id)
        .exec((err, activity) => {
            if (err) {
                return next(err);
            }
            if (!activity) {
                return next(new Error('Failed to load activity ' + id));
            }
            req.activity = activity;
            next();
        });
};

exports.read = function (req, res) {
    res.status(200).json(req.activity);
};

exports.delete = function (req, res, next) {
    const activity = req.activity;
    activity.remove(err => {
        if (err) {
            return next(err);
        }
        if (activity.photos.length) {
            const updir = `${dir}/${activity._id}`;
            activity.photos.forEach(photo => {
                fs.unlinkSync(`${updir}/${photo}`);
            });
            fs.rmdir(updir, (err) => {
                if (err) {
                    return next(err);
                }
            });
        }

        res.status(200).json(activity);
    })
};

exports.update = function (req, res) {
    const activity = req.activity;

    activity.name = req.body.name;
    activity.description = req.body.description;
    activity.photos = req.body.photos;

    activity.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (req.files) {
                const updir = `${dir}/${activity._id}`;

                try {
                    fs.accessSync(updir, fs.constants.R_OK);
                } catch (err) {
                    fs.mkdirSync(updir);
                }

                let photos = [];
                if (Array.isArray(req.files.photos)) {
                    req.files.photos.forEach(photo => {
                        photo.mv(`${updir}/${photo.name}`, function (err) {
                            if (err) {
                                return res.status(500).send(err);
                            }
                        });
                        photos.push(photo.name);
                    });
                }
                else {
                    let photo = req.files.photos;
                    photo.mv(`${updir}/${photo.name}`, function (err) {
                        if (err) {
                            return res.status(500).send(err);
                        }
                    });
                    photos.push(photo.name);
                }
                savePhotosDB(activity, photos);
            }
            res.status(204).end();
        }
    });
};

exports.getContacts = function (req, res) {
    User.find({ role: 'guide' }, 'firstName lastName')
        .sort('firstName')
        .exec((err, users) => {
            if (err) {
                return next(err);
            }
            else {
                res.status(200).json(users);
            }
        });
};

function getErrorMessage(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
}