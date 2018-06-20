const Activity = require('mongoose').model('Activity');
const User = require('mongoose').model('User');

exports.create = function (req, res, next) {
    const act = new Activity(req.body);

    act.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            res.status(201).end();
        }
    });
};

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
        .populate('guide', 'firstName lastName')
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

exports.delete = function (req, res) {
    const activity = req.activity;
    activity.remove(err => {
        if (err) {
            return next(err);
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