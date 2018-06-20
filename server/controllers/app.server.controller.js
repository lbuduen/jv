const Accomodation = require('mongoose').model('Accomodation');
const User = require('mongoose').model('User');
const Activity = require('mongoose').model('Activity');

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
                res.status(200).json(totals);
            })
        });
    });
};