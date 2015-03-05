var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var ShowSchema = new Schema({
  venue: {type: String},
  date: {type: String},
  time: {type: String},
  subtitle: {type: String},
  address: {type: String},
  maplink: {type: String},
  description: {type: String},
  website: {type: String}
});

module.exports = mongoose.model('Show', ShowSchema);
