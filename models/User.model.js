const mongoose = require("mongoose");
const mongoosePaginate = require('./plugin/model.paginate');

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    BusinessLocation: [{
        Gym: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jim',
            required: false
        },
        package: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Packages',
            required: false
        },
        status:{
            type: String,
            required: false,
            enum: ["active", "inactive", "blocked","pending"],
            default: "pending"
        },
        payment_status:{
            type: String,
            required: false,
            enum: ["paid", "unpaid"],
            default: "unpaid"
        },
        active_date:{
            type: Date,
            required: false,
        },
        inActive_date:{
            type: Date,
            required: false,
        },
        updated_on: {
            type: Date,
            required: false
        },
    }],

   
    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    images: {
        type: String,
        default: "https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-11.jpg"
    },
    city: {
        type: String,
    },
    adress: {
        type: String,
    },
    status: {
        type: String,
        required: false,
        enum: ["active", "inactive", "blocked","pending"],
        default: "pending"
    },
    payment_status: {
        type: String,
        required: false,
        enum: ["paid", "unpaid"],
        default: "unpaid"
    },
    active_date:{
        type: Date,
        required: false,
    },
    inActive_date:{
        type: Date,
        required: false,
    },
    role: {
        type: String,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isJimAdmin: {
        type: Boolean,
        default: false,
    },
 
}, {
    timestamps: true
})
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", userSchema)