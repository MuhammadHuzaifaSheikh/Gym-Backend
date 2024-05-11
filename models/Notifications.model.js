const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Notification Schema
const notificationSchema = new Schema({
    type: {
        type: String,
        enum: ['user', 'gym'],
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to User model if applicable
    },
    gymId: {
        type: Schema.Types.ObjectId,
        ref: 'Gym' // Reference to Gym model if applicable
    },
    show_to:{
        type: String,
        enum: ['admin', 'gym'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

// Define Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
