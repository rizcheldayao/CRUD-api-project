var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var characterSchema = new Schema({
  name: String,
  eyecolor: String,
  haircolor: String,
  height: Number,
  persona: { type: String },
  lands: { type: String},
  location: String,
  age: Number
});

var Character = mongoose.model('Character', characterSchema);
module.exports = Character;
