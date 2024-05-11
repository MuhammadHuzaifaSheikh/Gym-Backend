const controller = require("../controller/Jim.controller.js");
const { upload } = require("../middleware/multer.js");
const { verifyToken } = require("../utils/varifyToken.js");
const Router = require("express").Router();

Router.post("/addJim",upload.array("images"), controller.addBusinessLocation);
Router.get("/getAllBusinessLocation", controller.getAllBusinessLocation);
Router.get("/getOneLocation", controller.getOneBusinessLocation);
Router.delete("/deleteLocation/:id",verifyToken, controller.deleteLocation);
Router.put("/updateLocation/:id",verifyToken, controller.updateaBusinessLocation);

module.exports = Router;