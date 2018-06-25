const Accomodation = require('mongoose').model('Accomodation');
const User = require('mongoose').model('User');
const Activity = require('mongoose').model('Activity');
const TransportationByLand = require('mongoose').model('TransportationByLand');
const Customer = require('mongoose').model('Customer');
const Package = require('mongoose').model('Package');

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