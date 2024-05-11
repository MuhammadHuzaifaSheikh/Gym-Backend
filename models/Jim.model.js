const mongoose = require("mongoose");
const mongoosePaginate = require('./plugin/model.paginate');

const JimShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    adress: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
    city: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
        default: "https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-11.jpg"
    }],
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jim',
        required: false
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false,
        enum: ["active", "inactive", "blocked",'pending'],
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
   
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jim',
        require,d: false
    },
    updated_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jim',
        required: false
    },
    created_at:{
        type: Date,
        default: Date.now()
    },
    updated_at:{
        type: Date,
        default: null
    }
}, {
    timestamps: true
})
JimShema.plugin(mongoosePaginate);

let Jim = mongoose.model("Jim", JimShema)

module.exports=Jim