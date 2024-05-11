const mongoose = require('mongoose');
const mongoosePaginate = require('./plugin/model.paginate');

// Define the schema for GymPackage
const gymPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  is_jim_package: {
    type: Boolean,
    required: true
  },
  type:{
    type: String,
    required: false,
    enum:["custom","other"]
  },
  is_admin_package: {
    type: Boolean,
    required: true
  },
  BusinessLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jim',
    required: false
  },
  customPackageUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
gymPackageSchema.plugin(mongoosePaginate);

const Packages = mongoose.model('Packages', gymPackageSchema);

module.exports = Packages;
