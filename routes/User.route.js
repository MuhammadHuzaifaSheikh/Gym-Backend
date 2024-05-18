const controller = require("../controller/User.controller.js");
const { upload } = require("../middleware/multer.js");
const { verifyToken } = require("../utils/varifyToken.js");
const Router = require("express").Router();

Router.post("/addUser",upload.array("images") ,controller.addUser);
Router.post("/register",upload.array("images") ,controller.registerUser);
Router.post("/loginUser", controller.login);
Router.get("/getAllBusinessUser",verifyToken, controller.getAllByBusinessLocation);
Router.get("/getOne/:id", controller.getOne);
Router.put("/deleteUser",verifyToken, controller.deleteUser);
Router.put("/updateUser",verifyToken, controller.updateUser);
Router.put("/updatePassword/:id", controller.updatePassword);
Router.put("/updateUserStatus", controller.updateUserStatus);
// Router.put("/updateImage/:id", controller.updateImage);

module.exports = Router;