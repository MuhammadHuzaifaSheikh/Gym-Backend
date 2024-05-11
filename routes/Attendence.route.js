const { createUpdateAttendence, getAttendance, JimActiveUser, getpeakhours } = require("../controller/Attendence.controller");
const { verifyToken } = require("../utils/varifyToken");

const Router = require("express").Router();

Router.post("/addUpdateAttendence",verifyToken, createUpdateAttendence);
Router.get("/getAttendence",verifyToken, getAttendance);
Router.get("/getActiveUser",verifyToken, JimActiveUser);
Router.get("/getpeakhours",verifyToken, getpeakhours);

module.exports = Router;