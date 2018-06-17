const Accomodation = require('mongoose').model('Accomodation');

exports.create = function (req, res, next) {
    const accom = new Accomodation(req.body);

    accom.save(err => {
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
    Accomodation.findById(id, (err, accom) => {
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

exports.delete = function (req, res) {
    const accomodation = req.accomodation;
    accomodation.remove(err => {
        if (err) {
            return next(err);
        }
        res.status(200).json(accomodation);
    })
};

exports.update = function (req, res) {
    const accomodation = req.accomodation;

    accomodation.name = req.body.name;
    accomodation.type = req.body.type;
    accomodation.address = req.body.address;
    accomodation.phone = req.body.phone;
    accomodation.amenities = req.body.amenities;
    accomodation.active = req.body.active;
    accomodation.description = req.body.description;
    accomodation.photos = req.body.photos;
    accomodation.webpage = req.body.webpage;
    accomodation.observations = req.body.observations;
    accomodation.rooms = req.body.rooms;

    accomodation.save(err => {
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