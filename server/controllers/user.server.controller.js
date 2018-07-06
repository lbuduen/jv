const fs = require("fs");

const User = require("mongoose").model("User");
const Accomodation = require("mongoose").model("Accomodation");
const Transportation = require("mongoose").model("TransportationByLand");

const dir = "./assets/img/user";

exports.create = function (req, res, next) {
  const user = new User(req.body);

  user.save((err, usr) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
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
    }
  });
};

function savePhotosDB(user, photo) {
  user.photo = photo;
  user.save(err => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }
  });
}

exports.list = function (req, res, next) {
  User.find((err, users) => {
    if (err) {
      return next(err);
    } else {
      res.status(200).json(users);
    }
  });
};

exports.delete = function (req, res, next) {
  const user = req.user;

  let userRemover = function () {
    user.remove(err => {
      if (err) {
        return next(err);
      }
      if (user.photo) {
        const updir = `${dir}/${user._id}`;

        fs.unlinkSync(`${updir}/${user.photo}`);

        fs.rmdir(updir, err => {
          if (err) {
            return next(err);
          }
        });
      }

      res.status(200).json(user);
    });
  };

  if (user.role.some(r => r === "landlord")) {
    Accomodation.find({ contact: user._id }, (err, ldl) => {
      if (err) {
        return next(err);
      }
      if (!ldl.length) {
        userRemover();
      } else {
        res.status(412).end();
      }
    });
  }

  if (user.role.some(r => r === "driver")) {
    Transportation.find({ driver: user._id }, (err, drv) => {
      if (err) {
        return next(err);
      }
      if (!drv.length) {
        userRemover();
      } else {
        res.status(412).end();
      }
    });
  }
};

exports.userById = function (req, res, next, id) {
  User.findById(id, "-password -salt", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error("Failed to load user " + id));
    }

    req.user = user;
    next();
  });
};

exports.read = function (req, res) {
  res.status(200).json(req.user);
};

exports.update = function (req, res) {
  const user = req.user;

  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.phone = req.body.phone;
  user.role = req.body.role;
  user.password = req.body.password;

  user.save(err => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      if (req.files) {
        const updir = `${dir}/${user._id}`;

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
        savePhotosDB(user, photo.name);
      }
      res.status(204).end();
    }
  });
};

exports.login = function (req, res) {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      if (user && user.authenticate(req.body.password)) {
        if (delete user.password && delete user.salt) {
          res.status(200).json(user);
        }
      } else {
        return res.status(401).send({
          message: "Invalid credentials"
        });
      }
    }
  });
};

function getErrorMessage(err) {
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return "Unknown server error";
  }
}
