const { addContactQuery, deleteContactQuery, getContactQuery } = require("../controller/Contact.controller.js");
const { verifyToken } = require("../utils/varifyToken.js");
const Router = require("express").Router();

Router.post("/addcontact", addContactQuery);
Router.get("/getcontact", verifyToken, getContactQuery);
Router.delete("/deletecontact", deleteContactQuery);


module.exports = Router;