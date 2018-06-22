const Accomodation = require('mongoose').model('Accomodation');
const User = require('mongoose').model('User');

const fs = require('fs');

const dir = './assets/img/accomodation';

exports.create = function (req, res, next) {
    const accomodation = {};
    accomodation.name = req.body.name;
    accomodation.type = req.body.type;
    accomodation.address = req.body.address;
    accomodation.phone = req.body.phone;
    accomodation.amenities = req.body.amenities.split(',');
    accomodation.active = req.body.active;
    accomodation.description = req.body.description;
    accomodation.webpage = req.body.webpage;
    accomodation.observations = req.body.observations;
    accomodation.rooms = JSON.parse(req.body.rooms);
    accomodation.contact = req.body.contact;

    accom = new Accomodation(accomodation);
    accom.save((err, accomodation) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (req.files) {
                const updir = `${dir}/${accomodation._id}`;
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
                savePhotosDB(accomodation, photos);
            }
            res.status(201).end();
        }
    });
};

function savePhotosDB(accomodation, photos) {
    accomodation.photos = photos;
    accomodation.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
}

exports.list = function (req, res, next) {
    Accomodation.find((err, accoms) => {
        if (err) {
            return next(err);
        }
        else {
            res.status(200).json(accoms);
        }
    });
};

exports.accomById = function (req, res, next, id) {
    Accomodation.findById(id)
        .populate('contact', 'firstName lastName')
        .exec((err, accom) => {
            if (err) {
                return next(err);
            }
            if (!accom) {
                return next(new Error('Failed to load accomodotation ' + id));
            }
            req.accomodation = accom;
            next();
        });
};

exports.read = function (req, res) {
    res.status(200).json(req.accomodation);
};

exports.delete = function (req, res, next) {
    const accomodation = req.accomodation;
    accomodation.remove(err => {
        if (err) {
            return next(err);
        }
        const updir = `${dir}/${accomodation._id}`;
        accomodation.photos.forEach(photo => {
            fs.unlinkSync(`${updir}/${photo}`);
        });
        fs.rmdir(updir, (err) => {
            if (err) {
                return next(err);
            }
        });
        res.status(200).json(accomodation);
    })
};

exports.update = function (req, res) {
    const accomodation = req.accomodation;

    accomodation.name = req.body.name;
    accomodation.type = req.body.type;
    accomodation.address = req.body.address;
    accomodation.phone = req.body.phone;
    accomodation.amenities = req.body.amenities.split(',');
    accomodation.active = req.body.active;
    accomodation.description = req.body.description;
    accomodation.webpage = req.body.webpage;
    accomodation.observations = req.body.observations;
    accomodation.rooms = JSON.parse(req.body.rooms);
    accomodation.contact = req.body.contact;

    accomodation.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (req.files) {
                const updir = `${dir}/${accomodation._id}`;

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
                savePhotosDB(accomodation, photos);
            }
            res.status(204).end();
        }
    });
};

/**
 * Returns an array of users with landlord role
 */
exports.getContacts = function (req, res) {
    User.find({ role: 'landlord' }, 'firstName lastName')
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