const mongoose = require('mongoose');
const mongoosePaginate = require('./plugin/model.paginate');

// Define the schema for GymPackage
const transactionschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    BusinessLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jim',
        required: false
    },
    type: {
        type: String,
        required: true,
        enum: ['userPayment', 'jimpaymet']
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    },
    status: {
        type: String,
        enum: ['paid', 'pending']
    }
});
transactionschema.plugin(mongoosePaginate);

const Transaction = mongoose.model('Transaction', transactionschema);

module.exports = Transaction;
