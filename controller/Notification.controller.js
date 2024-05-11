const Notification = require('../models/Notifications.model');
const User = require('../models/User.model');

/**
 * Function to add a notification for user or gym request.
 * @param {String} type - Type of notification ('user_request' or 'gym_request').
 * @param {String} entityId - ID of the user or gym related to the notification.
 * @param {String} message - Notification message.
 * @returns {Promise} Promise representing the saved notification.
 */

async function addNotification(type, entityId, message) {
    try {
        let BusinessLocation = null
        if (type === 'user') {
            let userData = await User.findById(entityId).populate("BusinessLocation.Gym")
            entityId = userData.BusinessLocation[0].Gym.Owner
        }
        const newNotification = new Notification({
            type: type,
            userId: type === 'user' ? entityId : null,
            gymId: type === 'gym' ? entityId : null,
            show_to: type === 'gym' ? "admin" : "gym",
            show_id: BusinessLocation,
            message: message
        });

        // Save the notification to the database
        const savedNotification = await newNotification.save();
        return savedNotification;
    } catch (error) {
        throw new Error(`Error adding notification: ${error.message}`);
    }
}
async function markNotificationAsRead(req, res, next) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        let notifications;

        if (user.isAdmin) {
            notifications = await Notification.find({
                type: 'gym',
                show_to: 'admin',
                isRead: true
            });
        } else {
            notifications = await Notification.find({
                type: 'gym',
                show_to: 'user',
                show_id: userId,
                isRead: true
            });
        }

        const notificationsIds = notifications.map(noti => noti._id.toString());

        const updatedNotification = await Notification.updateMany(
            { _id: { $in: notificationsIds } },
            { $set: { isRead: true } }
        );

        if (!updatedNotification) {
            throw new Error('Notification not found.');
        }

        res.json({ message: 'Notifications marked as read successfully.' });
    } catch (error) {
        next(error); // Pass the error to the Express error handling middleware
    }
}

async function deletenotification(req, res, next) {
    try {
        const id = req.query.id

        const updatedNotification = await Notification.findByIdAndDelete(id);

        if (!updatedNotification) {
            throw new Error('Notification not found.');
        }

        res.status(200).send({ message: 'Notifications marked as read successfully.' });
    } catch (error) {
        next(error); // Pass the error to the Express error handling middleware
    }
}


async function displayUserNotifications(req, res, next) {
    try {
        let data = req.body.data
        let notifications;
        let notificationCount;
        let userId = req.user.id
        let user = await User.findById(userId)
        if (user.isAdmin) {

            notifications = await Notification.find({
                type: 'gym',
                show_to: "admin"
            });
            notificationCount = await Notification.countDocuments({
                type: 'gym',
                show_to: "admin",
                isRead: false
            })
        } else {
            notifications = await Notification.find({
                type: 'gym',
                show_to: "user",
                show_id:userId,
            });
            notificationCount = await Notification.countDocuments({
                type: 'gym',
                show_to: "user",
                show_id:userId,
                isRead: false
            })
        }

        return res.status(200).send({
            success: true,
            message: "notifications",
            status: 200,
            data: {
                notifications: notifications,
                notificationCount: notificationCount
            }
        })
    } catch (error) {
        next(error)
    }
}


module.exports = { addNotification, markNotificationAsRead, displayUserNotifications ,deletenotification};
