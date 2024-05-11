const mongoose = require('mongoose');
const mongoosePaginate = require('./plugin/model.paginate');

// Define the schema for GymPackage
const ContachQueryschema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  message: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  images: {
    type: String,
    required: false
  },
  submitted_by:{
    type: String,
    required: false,
    enum:["user","gym"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
ContachQueryschema.plugin(mongoosePaginate);

const ContachQuery = mongoose.model('ContachQuery', ContachQueryschema);

module.exports = ContachQuery;
