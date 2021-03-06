const crypto = require("crypto");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      required: "Email is required",
      match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
    },
    photo: String,
    phone: String,
    salt: String,
    password: {
      type: String,
      validate: [
        function(password) {
          if (password) {
            return password && password.length >= 8;
          }
          return true;
        },
        "Password should be longer"
      ]
    },
    created: {
      type: Date,
      default: Date.now
    }
  },
  { toJSON: { virtuals: true } }
);

CustomerSchema.virtual("fullName")
  .get(function() {
    return this.firstName + " " + this.lastName;
  })
  .set(function(fullName) {
    var splitName = fullName.split(" ");
    this.firstName = splitName[0] || "";
    this.lastName = splitName[1] || "";
  });

CustomerSchema.pre("save", function(next) {
  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString("base64"), "base64");
    this.password = this.hashPassword(this.password);
  }
  next();
});

CustomerSchema.methods.hashPassword = function(password) {
  return crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha1")
    .toString("base64");
};

CustomerSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

mongoose.model("Customer", CustomerSchema);
