const Attendance = require("../models/Attendence.model");
const User = require("../models/User.model");
const { pick } = require("../utils/pick");


const createUpdateAttendence = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let jimId = req.query.jimId;


        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        // Punch Out
        if (req.body.status === 'punchOut') {
            const updateUs = await Attendance.findOneAndUpdate(
                { _id: req.body._id },
                { $set: {...req.body, punchOutTime: new Date()} },
                { new: true }
            );

            return res.status(200).send({
                success: true,
                message: "Attendance punchOut successfully",
                data: updateUs
            });
        }

        // Punch In
        const attendance = await Attendance.create({
            user: userId,
            BusinessLocation: jimId,
            punchInTime: new Date(),
           
            status: "punchIn",
            created_at: new Date(),
            created_by: userId
        });



        return res.status(200).send({
            success: true,
            message: "Attendance PunchIn successfully",
            data: attendance
        });
    } catch (error) {
        console.log(error);
        next(error);
    }

};



const getAttendance = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let jimId = req.query.jimId;

        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        // Assuming Attendance is your mongoose model
        const attendance = await Attendance.find(
            {
            user: userId, // Filter by user ID
            BusinessLocation: jimId, // Filter by Business Location ID
            status: "punchOut", // Filter by status
            // createdAt: { $gte: todayDate } // Filter by createdAt, starting from today
        }
    );

        if (attendance.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No attendance found for today"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Attendance found for today",
            data: attendance
        });
    } catch (error) {
        console.error("Error in getAttendance:", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

const JimActiveUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let jimId = req.query.jimId
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        const activeUser = await Attendance.find({
            BusinessLocation: jimId,
            status: "punchIn",
            created_at: { $gte: todayDate }
        });
        const total_user = await User.find({
            "BusinessLocation.Gym": jimId,
            status: "active",
            isJimAdmin: false
        });

        const activeUserCount = activeUser.length;
        const totalUserCount = total_user.length;

        return res.status(200).send({
            success: true,
            message: "Active User",
            data: {
                active_users: activeUserCount,
                total_users: totalUserCount
            }
        });

    } catch (error) {
        next(error);
    }
};
// const mongoose = require('mongoose');

// const Attendance = require('../models/attendance');

// // Function to calculate peak hours of user activity
// async function calculatePeakHours() {
//     const startTimeIntervals = [
//         { label: '12:00-15:59', startHour: 12, endHour: 15 },
//         { label: '16:00-19:59', startHour: 16, endHour: 19 },
//         { label: '20:00-23:59', startHour: 20, endHour: 23 },
//         { label: '00:00-03:59', startHour: 0, endHour: 3 },
//         { label: '04:00-07:59', startHour: 4, endHour: 7 },
//         { label: '08:00-11:59', startHour: 8, endHour: 11 }
//     ];

//     // Prepare an object to store counts of active users per time interval
//     const activeUsersByInterval = {};

//     // Initialize counts for each time interval
//     for (const interval of startTimeIntervals) {
//         activeUsersByInterval[interval.label] = 0;
//     }

//     // Query attendance data from MongoDB
//     const attendances = await Attendance.find({});

//     // Process each attendance record
//     attendances.forEach(attendance => {
//         const punchInHour = attendance.punchInTime.getHours();

//         // Check each time interval and increment active user count if applicable
//         for (const interval of startTimeIntervals) {
//             if (punchInHour >= interval.startHour && punchInHour <= interval.endHour) {
//                 activeUsersByInterval[interval.label]++;
//                 break; // Exit loop once matched
//             }
//         }
//     });

//     return activeUsersByInterval;
// }

// module.exports = { calculatePeakHours };


// module.exports = { peakHoursLast7Days };
// const getpeakhours = async (req, res, next) => {
//     try {
//         let gymId= req.query.jimId
//         const startDate = new Date();
//         startDate.setHours(0, 0, 0, 0);
//         startDate.setDate(startDate.getDate() - 6); // Set start date to seven days ago

//         const endDate = new Date();
//         endDate.setHours(23, 59, 59, 999);

//         const startTimeIntervals = [
//             { label: '12:00-15:59', startHour: 12, endHour: 15 },
//             { label: '16:00-19:59', startHour: 16, endHour: 19 },
//             { label: '20:00-23:59', startHour: 20, endHour: 23 },
//             { label: '00:00-03:59', startHour: 0, endHour: 3 },
//             { label: '04:00-07:59', startHour: 4, endHour: 7 },
//             { label: '08:00-11:59', startHour: 8, endHour: 11 }
//         ];

//         // Prepare an object to store sums of active users per time interval
//         const totalActiveUsersByInterval = {};

//         // Initialize sums for each time interval
//         for (const interval of startTimeIntervals) {
//             totalActiveUsersByInterval[interval.label] = 0;
//         }

//         // Query attendance data from MongoDB for the last seven days
//         const attendances = await Attendance.find({
//             punchInTime: { $gte: startDate, $lte: endDate },
//             BusinessLocation: gymId
//         });

//         // Process each attendance record
//         attendances.forEach(attendance => {
//             const punchInHour = attendance.punchInTime.getHours();

//             // Check each time interval and increment active user sum if applicable
//             for (const interval of startTimeIntervals) {
//                 if (punchInHour >= interval.startHour && punchInHour <= interval.endHour) {
//                     totalActiveUsersByInterval[interval.label]++;
//                     break; // Exit loop once matched
//                 }
//             }
//         });

//         // Calculate average active users per time interval
//         const numDays = 7; // Number of days in the range
//         const averageActiveUsersByInterval = {};

//         for (const interval of startTimeIntervals) {
//             averageActiveUsersByInterval[interval.label] = totalActiveUsersByInterval[interval.label] / numDays;
//         }

//         return res.status(200).send({
//             success: true,
//             message: "Active User",
//             data: averageActiveUsersByInterval
//         });
//     } catch (error) {
//         throw new Error(`Failed to calculate average active users: ${error.message}`);
//     }
// };


const getPeakHours = async (req, res, next) => {


    try {
    const { gymId,user} = req.query;
         const userId = user?._id;
        const isJimAdmin = user?.isJimAdmin;


         
        // Construct start and end of the day based on provided date
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        // Find attendance records for the specified location and date
        let filter = {
            // punchInTime: { $gte: startDate, $lte: endDate },
            BusinessLocation: gymId,
        };

        if (!isJimAdmin) {
            filter.user = userId;
        }

        const attendance = await Attendance.find(filter);

        // Count attendance for each hour of the day
        const peakHours = new Array(24).fill(0); // Initialize array for 24 hours
        attendance.forEach(record => {
            const hour = record.punchInTime.getHours();
            peakHours[hour]++;
        });

        // Return hours with at least one attendance record
        const busyHours = [];
        peakHours.forEach((count, hour) => {
            if (count > 0) {
                const time = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
                busyHours.push({ time, count });
            }
        });

        return res.status(200).json({
            success: true,
            message: "Peak hours found",
            data: busyHours
        });
    } catch (error) {
        console.log("Error in getPeakHours:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
module.exports = {
    createUpdateAttendence,
    getAttendance,
    JimActiveUser,
    getPeakHours
}