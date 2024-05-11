const { displayUserNotifications, deletenotification, markNotificationAsRead } = require("../controller/Notification.controller.js");
const { verifyToken } = require("../utils/varifyToken.js");
const Router = require("express").Router();

Router.get("/getNotifications", verifyToken, displayUserNotifications);
Router.get("/markread", verifyToken,markNotificationAsRead );
Router.get("/delete", verifyToken, deletenotification);



module.exports = Router;