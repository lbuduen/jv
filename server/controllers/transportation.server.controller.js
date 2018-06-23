const TransportationByLand = require('mongoose').model('TransportationByLand');
const TransportationByAir = require('mongoose').model('TransportationByAir');
let TransportationModel;

const User = require('mongoose').model('User');
const fs = require('fs');

const dir = './assets/img/transportation';

exports.create = function (req, res, next) {
    const trans = new TransportationByLand(req.body);

    trans.save((err, transportation) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (req.files) {
                const updir = `${dir}/${transportation._id}`;
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
                savePhotosDB(transportation, photos);
            }
            res.status(201).end();
        }
    });
};

function savePhotosDB(transportation, photos) {
    transportation.photos = photos;
    transportation.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
}

exports.list = function (req, res, next) {
    TransportationByLand.find()
        .populate('driver', 'firstName lastName')
        .exec((err, vehicles) => {
            if (err) {
                return next(err);
            }
            else {
                res.status(200).json(vehicles);
            }
        });
};

exports.getDrivers = function (req, res) {
    User.find({ role: 'driver' }, 'firstName lastName')
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

exports.setTransportationMeans = function (req, res, next, means) {
    TransportationModel = (means == 'land') ? TransportationByLand : TransportationByAir;
    req.means = means;
};

exports.transportationById = function (req, res, next, id) {
    TransportationByLand.findById(id)
        .populate('driver', 'firstName lastName')
        .exec((err, transport) => {
            if (err) {
                return next(err);
            }
            if (!transport) {
                return next(new Error('Failed to load transport ' + id));
            }
            req.transport = transport;
            next();
        });
};

exports.read = function (req, res) {
    res.status(200).json(req.transport);
};

exports.update = function (req, res) {
    const transportation = req.transport;

    transportation.driver = req.body.driver;
    transportation.brand = req.body.brand;
    transportation.model = req.body.model;
    transportation.plate = req.body.plate;
    transportation.capacity = req.body.capacity;
    transportation.color = req.body.color;
    transportation.observations = req.body.observations;

    transportation.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (req.files) {
                const updir = `${dir}/${transportation._id}`;

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
                savePhotosDB(transportation, photos);
            }
            res.status(204).end();
        }
    });
};

exports.delete = function (req, res, next) {
    const transport = req.transport;
    transport.remove(err => {
        if (err) {
            return next(err);
        }
        if (transport.photos.length) {
            const updir = `${dir}/${transport._id}`;
            transport.photos.forEach(photo => {
                fs.unlinkSync(`${updir}/${photo}`);
            });
            fs.rmdir(updir, (err) => {
                if (err) {
                    return next(err);
                }
            });
        }

        res.status(200).json(transport);
    })
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