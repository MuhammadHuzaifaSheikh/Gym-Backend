// models/attendance.js
const mongoose = require('mongoose');
const mongoosePaginate = require('./plugin/model.paginate');

const attendanceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        BusinessLocation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jim',
            required: false
        },
        punchInTime: {
            type: Date,
            default: Date.now
        },
        punchOutTime: {
            type: Date,
            required: false
        },
        total_mint_spend: {
            type: Number,
            required: false,
            default:0
        },
        status: {
            type: String,
            required: false
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
      
        updated_at: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true
    });


attendanceSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Attendance', attendanceSchema);

