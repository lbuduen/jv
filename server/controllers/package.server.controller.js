const fs = require('fs');

const dir = './assets/img/packages';

const Package = require('mongoose').model('Package');
const Accomodation = require('mongoose').model('Accomodation');
const User = require('mongoose').model('User');
const Activity = require('mongoose').model('Activity');
const TransportationByLand = require('mongoose').model('TransportationByLand');

exports.create = function (req, res, next) {

    const package = req.body;
    package.transportation = package.transportation.split(',');
    package.accomodation = package.accomodation.split(',');
    package.activities = package.activities.split(',');

    const pkg = new Package(package);

    pkg.save((err, package) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (req.files) {
                const updir = `${dir}/${package._id}`;
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
                savePhotosDB(package, photos);
            }
            res.status(201).end();
        }
    });
};

function savePhotosDB(package, photos) {
    package.photos = photos;
    package.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
}

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

exports.getAccomodation = function (req, res) {
    Accomodation.find({}, 'name type rooms')
        .sort('name')
        .exec((err, accom) => {
            if (err) {
                return next(err);
            }
            else {
                res.status(200).json(accom);
            }
        });
};

exports.getTransportation = function (req, res) {
    TransportationByLand.find({}, 'brand model plate capacity')
        .sort('-capacity')
        .exec((err, transp) => {
            if (err) {
                return next(err);
            }
            else {
                res.status(200).json(transp);
            }
        });
};

exports.getActivities = function (req, res) {
    Activity.find({}, 'name')
        .sort('name')
        .exec((err, act) => {
            if (err) {
                return next(err);
            }
            else {
                res.status(200).json(act);
            }
        });
};

exports.list = function (req, res, next) {
    Package.find((err, packages) => {
        if (err) {
            return next(err);
        }
        else {
            res.status(200).json(packages);
        }
    });
};

exports.packageById = function (req, res, next, id) {
    Package.findById(id)
        .populate({
            path: 'customers.id',
            select: '-_id -salt -password',
        })
        .populate('accomodation')
        .populate('transportation')
        .populate('activities')
        .exec((err, package) => {
            if (err) {
                return next(err);
            }
            if (!package) {
                return next(new Error('Failed to load package ' + id));
            }
            req.package = package;
            next();
        });
};

exports.read = function (req, res) {
    res.status(200).json(req.package);
};