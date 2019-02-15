const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },    // nije kao validator i ne izbacuje odmah gresku ako je isti email
  password: { type: String, requred: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

// za proveru jedinstvenosti email-a u databazi instaliramo paket npm install --save mongoose-unique-validator
// i moramo da ga povezemo tj. koristimo ga kao plugin i kacimo ka na Schema
// i sada bismo dobili gresku
