var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
  name: {type: String},
  eyecolor: {type: String},
  haircolor: {type: String},
  height: {type: Number},
  persona: [String],
  lands: [String],
  location: {type: String},
  age: {type: Number}
});

module.exports = mongoose.model('Character', CharacterSchema);
