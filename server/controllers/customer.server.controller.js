const fs = require('fs');

const Customer = require('mongoose').model('Customer');
const Package = require('mongoose').model('Package');

const dir = './assets/img/customer';

exports.create = function (req, res, next) {
    Package.findById(req.body.pkg, (err, package) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        if (package) {
            const customer = new Customer();

            customer.firstName = req.body.firstName;
            customer.lastName = req.body.lastName;
            customer.email = req.body.email;
            customer.phone = req.body.phone;
            customer.password = req.body.password;

            customer.save((err, usr) => {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                }

                package.customers.push({
                    id: usr._id,
                    rate: req.body.rate,
                    status: req.body.status
                });

                package.save((err, pkg) => {
                    if (err) {
                        return res.status(400).send({
                            message: getErrorMessage(err)
                        });
                    }
                });

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
            });
        }
        else {
            res.status(404).end();
        }
    });
}

function savePhotosDB(customer, photo) {
    customer.photo = photo;
    customer.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
}

exports.list = function (req, res, next) {
    Customer.find((err, customers) => {
        if (err) {
            return next(err);
        }
        else {
            res.status(200).json(customers);
        }
    });
};

exports.delete = function (req, res, next) {
    const customer = req.customer;
    customer.remove(err => {
        if (err) {
            return next(err);
        }
        if (customer.photo) {
            const updir = `${dir}/${customer._id}`;

            fs.unlinkSync(`${updir}/${customer.photo}`);

            fs.rmdir(updir, (err) => {
                if (err) {
                    return next(err);
                }
            });
        }

        res.status(200).json(customer);
    })
};

exports.customerById = function (req, res, next, id) {
    Customer.findById(id, '-password -salt', (err, customer) => {
        if (err) {
            return next(err);
        }
        if (!customer) {
            return next(new Error('Failed to load customer ' + id));
        }

        req.customer = customer;
        next();
    });
};

exports.read = function (req, res) {
    res.status(200).json(req.customer);
};

exports.update = function (req, res) {
    const customer = req.customer;

    customer.firstName = req.body.firstName;
    customer.lastName = req.body.lastName;
    customer.email = req.body.email;
    customer.phone = req.body.phone;
    customer.password = req.body.password;
    customer.packages = [];
    customer.packages.push(req.body.pkg);
    customer.rate = req.body.rate;
    customer.status = req.body.status;

    customer.save(err => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (req.files) {
                const updir = `${dir}/${customer._id}`;

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
                savePhotosDB(customer, photo.name);
            }
            res.status(204).end();
        }
    });
};


exports.login = function (req, res) {
    Customer.findOne({ "email": req.body.email }, (err, customer) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            if (customer && customer.authenticate(req.body.password)) {
                res.status(200).json(customer);
            }
            else {
                return res.status(401).send({
                    message: 'Invalid credentials'
                });
            }
        }
    });
};

exports.getPackages = function (req, res) {
    Package.find({'active': true}, 'name startDate endDate')
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