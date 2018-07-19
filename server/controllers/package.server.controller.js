const fs = require("fs");

const dir = "./assets/img/packages";

const Package = require("mongoose").model("Package");
const Accomodation = require("mongoose").model("Accomodation");
const User = require("mongoose").model("User");
const Activity = require("mongoose").model("Activity");
const TransportationByLand = require("mongoose").model("TransportationByLand");
const Customer = require('mongoose').model('Customer');

exports.create = function (req, res, next) {
  if (req.body.quota == 'null') {
    delete req.body.quota;
  }

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
  if (!pkg.active) {
    pkg.remove(err => {
      if (err) {
        return next(err);
      }
      res.status(200).json(pkg);
    });
  }
  else {
    res.status(412).end();
  }
};

exports.createSpreadsheet = function (req, res, next) {
  const xl = require("excel4node");

  const wb = new xl.Workbook();

  const details_ws = wb.addWorksheet("Details");
  const customers_ws = wb.addWorksheet("Customers");
  const transp_ws = wb.addWorksheet("Transportation");
  const accom_ws = wb.addWorksheet("Accomodation");
  const act_ws = wb.addWorksheet("Activities");

  // details headers 
  details_ws.cell(1, 1).string('Package');
  details_ws.cell(1, 2).string('Quota');
  details_ws.cell(1, 3).string('Start date');
  details_ws.cell(1, 4).string('End date');
  details_ws.cell(1, 5).string('Private rate');
  details_ws.cell(1, 6).string("Joiner's rate");
  details_ws.cell(1, 7).string("Description");

  // details content
  details_ws.cell(2, 1).string(req.package.details.name);
  details_ws.cell(2, 2).string(req.package.details.quota ? req.package.details.quota : '-');
  details_ws.cell(2, 3).date(req.package.details.startDate);
  details_ws.cell(2, 4).date(req.package.details.endDate);
  details_ws.cell(2, 5).number(req.package.details.privateRate);
  details_ws.cell(2, 6).number(req.package.details.joinerRate);
  details_ws.cell(2, 7).string(req.package.details.description);


  // customers headers
  customers_ws.cell(1, 1).string('Full name');
  customers_ws.cell(1, 2).string('Email');
  customers_ws.cell(1, 3).string('Phone number');
  customers_ws.cell(1, 4).string('Requested');
  customers_ws.cell(1, 5).string('Status');
  customers_ws.cell(1, 6).string("Rate");
  customers_ws.cell(1, 7).string("Amount");

  // customers content
  let row = 2;
  req.package.details.customers.forEach((customer) => {
    customers_ws.cell(row, 1).string(customer.id.fullName);
    customers_ws.cell(row, 2).string(customer.id.email);
    customers_ws.cell(row, 3).string(customer.id.phone);
    customers_ws.cell(row, 4).date(customer.requested);
    customers_ws.cell(row, 5).string(customer.status);
    customers_ws.cell(row, 6).string(customer.rate);

    let amount = customer.rate == 'private' ? req.package.details.privateRate : req.package.details.joinerRate;
    customers_ws.cell(row++, 7).number((customer.status == 'paid' || customer.status == 'completed') ? amount : 0);
  });
  customers_ws.cell(row, 6).string('Total:');
  if (row > 3) {
    customers_ws.cell(row, 7).formula(`G2 + G${row - 1}`);
  }
  else {
    customers_ws.cell(row, 7).formula(`G2 + 0`);
  }

  // transportation content
  row = 0;
  req.package.transportation.forEach((transp) => {
    transp_ws.cell(row += 2, 1).string(`${transp.vehicle.brand} ${transp.vehicle.model}`);
    transp_ws.cell(row, 2).string(transp.vehicle.plate);
    transp_ws.cell(row, 3).date(transp.date);

    transp.riders.forEach((customer) => {
      transp_ws.cell(++row, 1).string(customer.id.fullName);
      transp_ws.cell(row, 2).string(customer.rate);
    });

  });

  // accomodation content
  row = 0;
  req.package.accomodation.forEach(accom => {
    accom_ws.cell(row += 2, 1).string(`${accom.accomodation.name} ${accom.accomodation.type}`);
    accom_ws.cell(++row, 1).string(`Room ${accom.room.number} (${accom.room.type})`);
    accom_ws.cell(row, 2).string(`Room ${accom.room.beds} bed(s)`);
    accom_ws.cell(row, 3).date(accom.startDate);
    accom_ws.cell(row, 4).date(accom.endDate);

    accom.customers.forEach((customer) => {
      accom_ws.cell(++row, 1).string(customer.id.fullName);
      accom_ws.cell(row, 2).string(customer.rate);
    });
  });

  // activities content
  row = 0;
  req.package.activities.forEach(act => {
    act_ws.cell(row += 2, 1).string(act.activity.name);
    act_ws.cell(row, 2).date(act.date);

    if (act.guide) {
      act_ws.cell(++row, 1).string('Guide');
      act_ws.cell(row, 2).string(act.guide.fullName);
      act_ws.cell(row, 3).string(act.guide.phone);
    }

    act.customers.forEach((customer) => {
      act_ws.cell(++row, 1).string(customer.id.fullName);
      act_ws.cell(row, 2).string(customer.rate);
    });
  });

  wb.write("Package.xlsx", res);
};

exports.getNewCustomers = function (req, res, next) {
  Package.findById(req.body.id, 'customers', (err, pkg) => {
    if (err) {
      return next(err);
    }
    const ids = pkg.customers.map(cust => cust.id);
    Customer.find({ _id: { $nin: ids } }, (err, customers) => {
      if (err) {
        return next(err);
      }
      else {
        res.status(200).json(customers);
      }
    });
  });
};

exports.setNewCustomers = function (req, res, next) {
  Package.findById(req.body.id, 'customers', (err, pkg) => {
    if (err) {
      return next(err);
    }

    req.body.customers.forEach(customer => {
      const cust = {
        id: customer._id,
        rate: customer.rate,
        status: customer.status,
        requested: customer.requested
      };
      pkg.customers.push(cust);
    });

    pkg.save((err, pkg) => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      }
      res.status(204).end();
    });
  });
};
