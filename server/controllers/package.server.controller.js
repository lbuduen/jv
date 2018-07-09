const fs = require("fs");

const dir = "./assets/img/packages";

const Package = require("mongoose").model("Package");
const Accomodation = require("mongoose").model("Accomodation");
const User = require("mongoose").model("User");
const Activity = require("mongoose").model("Activity");
const TransportationByLand = require("mongoose").model("TransportationByLand");

exports.create = function (req, res, next) {
  const pkg = new Package(req.body);

  pkg.save((err, package) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
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
        } else {
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
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return "Unknown server error";
  }
}

exports.getAccomodation = function (req, res) {
  Accomodation.find({ active: true }, "name type rooms")
    .sort("name")
    .exec((err, accom) => {
      if (err) {
        return next(err);
      } else {
        res.status(200).json(accom);
      }
    });
};

exports.getTransportation = function (req, res) {
  TransportationByLand.find({}, "brand model plate capacity")
    .sort("-capacity")
    .exec((err, transp) => {
      if (err) {
        return next(err);
      } else {
        res.status(200).json(transp);
      }
    });
};

exports.getActivities = function (req, res) {
  Activity.find({}, "name")
    .sort("name")
    .exec((err, act) => {
      if (err) {
        return next(err);
      } else {
        res.status(200).json(act);
      }
    });
};

exports.getGuides = function (req, res) {
  User.find({ role: "guide" }, "firstName lastName")
    .sort("firstName")
    .exec((err, guides) => {
      if (err) {
        return next(err);
      } else {
        res.status(200).json(guides);
      }
    });
};

exports.list = function (req, res, next) {
  Package.find((err, packages) => {
    if (err) {
      return next(err);
    } else {
      res.status(200).json(packages);
    }
  });
};

exports.packageById = function (req, res, next, id) {
  Package.findById(id)
    .populate({
      path: "customers.id",
      select: "-_id -salt -password"
    })
    .populate({
      path: "activities.id"
    })
    .populate({
      path: "activities.guide"
    })
    .populate({
      path: "transportation.id"
    })
    .populate({
      path: "accomodation.accomodation"
    })

    .exec((err, package) => {
      if (err) {
        return next(err);
      }
      if (!package) {
        return next(new Error("Failed to load package " + id));
      }

      const activities = [];
      const accomodation = [];
      const transportation = [];

      package.activities.forEach(act => {
        const activity = {
          activity: act.id,
          guide: act.guide,
          customers: [],
          date: act.date
        };
        act.customers.forEach(id => {
          package.customers.forEach(customer => {
            if (customer._id.toString() == id) {
              activity.customers.push(customer);
            }
          });
        });
        activities.push(activity);
      });

      package.accomodation.forEach(acc => {
        const accom = {
          accomodation: acc.accomodation,
          room: {},
          customers: [],
          startDate: acc.startDate,
          endDate: acc.endDate
        };
        acc.accomodation.rooms.forEach(room => {
          if (room._id.toString() == acc.room) {
            accom.room = room;
          }
        });
        acc.customers.forEach(id => {
          package.customers.forEach(customer => {
            if (customer._id.toString() == id) {
              accom.customers.push(customer);
            }
          });
        });
        accomodation.push(accom);
      });

      package.transportation.forEach(transport => {
        const transp = {
          vehicle: transport.id,
          riders: [],
          pickup: transport.pickup,
          dropoff: transport.dropoff,
          date: transport.date
        };

        transport.customers.forEach(id => {
          package.customers.forEach(customer => {
            if (customer._id.toString() == id) {
              transp.riders.push(customer);
            }
          });
        });

        transportation.push(transp);
      });

      req.package = {
        details: package,
        activities: activities,
        accomodation: accomodation,
        transportation: transportation,
      };
      next();
    });
};

exports.read = function (req, res) {
  res.status(200).json(req.package);
};

exports.setStatus = function (req, res, next) {
  Package.findById(req.body.pkg, (err, pkg) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }
    if (!pkg) {
      return next(new Error("Failed to load package " + req.body.pkg));
    }
    const customer = pkg.customers.id(req.body.customer);
    customer.status = req.body.status;
    pkg.save(err => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      }
      res.status(204).end();
    });
  });
};

exports.removeCustomer = function (req, res, next) {
  Package.findById(req.body.pkg, (err, pkg) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }
    if (!pkg) {
      return next(new Error("Failed to load package " + req.body.pkg));
    }
    pkg.customers.id(req.body.customer).remove();
    pkg.save(err => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      }
      res.status(204).end();
    });
  });
};

exports.setUp = function (req, res, next) {
  const pkg = req.package.details;

  pkg.activities = req.body.activists;
  pkg.transportation = req.body.riders;
  pkg.accomodation = req.body.guests;

  pkg.save((err, p) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }
    res.status(204).end();
  });
};

exports.update = function (req, res, next) {
  const pkg = req.package.details;
  pkg.update({ $set: req.body }, (err, raw) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }
    res.status(204).end();
  });
};

exports.delete = function (req, res, next) {
  const pkg = req.package.details;
  pkg.remove(err => {
    if (err) {
      return next(err);
    }
    res.status(200).json(pkg);
  });
};
