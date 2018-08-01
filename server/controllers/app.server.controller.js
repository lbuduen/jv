const Accomodation = require('mongoose').model('Accomodation');
const User = require('mongoose').model('User');
const Activity = require('mongoose').model('Activity');
const TransportationByLand = require('mongoose').model('TransportationByLand');
const Customer = require('mongoose').model('Customer');
const Package = require('mongoose').model('Package');

Date.prototype.sameDay = function (d) {
    return this.getFullYear() === d.getFullYear()
        && this.getDate() === d.getDate()
        && this.getMonth() === d.getMonth();
}

exports.totalCounts = function (req, res, next) {
    let totals = {};

    Accomodation.count({}, (err, acount) => {
        if (err) {
            return next(err);
        }
        totals.accomodation = acount;

        User.count({}, (err, ucount) => {
            if (err) {
                return next(err);
            }
            totals.users = ucount;

            Activity.count({}, (err, actcount) => {
                if (err) {
                    return next(err);
                }
                totals.activities = actcount;

                TransportationByLand.count({}, (err, trcount) => {
                    if (err) {
                        return next(err);
                    }
                    totals.transportation = trcount;

                    Customer.count({}, (err, ccount) => {
                        if (err) {
                            return next(err);
                        }
                        totals.customers = ccount;

                        Package.count({}, (err, pcount) => {
                            if (err) {
                                return next(err);
                            }
                            totals.packages = pcount;
                            res.status(200).json(totals);
                        })
                    })
                })
            })
        });
    });
};

exports.dashboardSummary = function (req, res, next) {
    Package.find((err, pkgs) => {
        if (err) {
            return next(err);
        }
        if (!pkgs) {
            return next(new Error('No packages'));
        }
        const startDate = new Date(req.body.startDate);
        const endDate = req.body.endDate ? new Date(req.body.endDate) : null;

        let response = {
            requests: 0,
            amount: 0
        };
        pkgs.forEach(pk => {
            pk.customers.forEach(c => {
                if (endDate) {
                    if (startDate <= c.requested && endDate >= c.requested) {
                        response.requests++;
                    }

                    if (c.status == 'paid' || c.status == 'completed') {
                        if (startDate <= c.requested && endDate >= c.requested) {
                            response.amount += (c.rate == 'joiner') ? pk.joinerRate : pk.privateRate;
                        }
                    }
                }
                else  {
                    if (c.requested.sameDay(startDate)) {
                        response.requests++;
                    }

                    if (c.status == 'paid' || c.status == 'completed') {
                        if (c.paid.sameDay(startDate)) {
                            response.amount += (c.rate == 'joiner') ? pk.joinerRate : pk.privateRate;
                        }
                    }
                }
            });
        });
        res.status(200).json(response);
    });
};
