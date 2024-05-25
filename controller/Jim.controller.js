const Jim = require("../models/Jim.model");
const { createError } = require("../utils/error");
const User = require("../models/User.model");
const CrudServices = require("../utils/crudServices");
const { pick, App_host } = require("../utils/pick");
const { AddJIM } = require("../validator/Jim.validor");
const { upload } = require("../middleware/multer");
const bcrypt = require("bcrypt");
const { AddTransaction } = require("./expenses.controller");
const Packages = require("../models/Packages.model");
const { addNotification } = require("./Notification.controller");
require('dotenv').config();

module.exports = {
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////// request to create user /////////////////
    async addBusinessLocation(req, res, next) {
        try {
            const { error } = AddJIM.validate(req.body);
            if (error) {
                return next(createError(404, error.message))
            }
            const checkBusinessLocation = await Jim.findOne({
                name: {
                    $regex: '^' + req.body.gymName + '$',
                    $options: 'i',
                },
            })
            if (checkBusinessLocation) {
                return next(createError(404, "A Jim with this name already exist"))
            }
            if (!req.body.status) {
                req.body["status"] = "inactive"

            }
            let AdminPackage = await Packages.findOne({
                is_admin_package: true
            })
            if (!AdminPackage) {
                return next(createError(404, "Ask Admin To add Package"))
            }
            req.body['package'] = AdminPackage._id.toString()
            req.body['name'] = req.body.gymName
            req.body['adress'] = req.body.gymAddress

            req.body['created_at'] = new Date()
            req.body['updated_at'] = new Date()
            req.body['images'] = []
            if (req.files && req.files.length) {
                req.files.forEach(element => {
                    req.body['images'].push(`${App_host}profile/images/${element.filename}`)
                });
            }

            let businessLocation = await new Jim(req.body)

            let userExist = await User.findOne({
                email: req.body.email
            })
            if (userExist) {
                return next(createError(404, "A User with this email already exist"))
            }
            req.body["isJimAdmin"] = true
            if (req.files && req.files.length) {
                let element = req.files[0]
                req.body['images'] = `${App_host}profile/images/${element.filename}`
            }
            req.body["BusinessLocation"] = [{
                Gym: businessLocation._id.toString(),
                package: req.body.package
            }]
            const salt = bcrypt.genSaltSync(10)
            const hash = await bcrypt.hashSync(req.body.password, salt)

            let user = await new User({
                ...req.body,
                password: hash
            })

            businessLocation['Owner'] = user._id.toString()
            businessLocation['created_by'] = user._id.toString()

            await businessLocation.save()

            await user.save()

            if (req.body.status == "inactive") {
                await addNotification("gym", businessLocation._id.toString(), `new gym Request from ${req.body.name}`)
            }

            await AddTransaction(req.body.package, user._id.toString(), businessLocation._id.toString(), next)


            console.log("req.body",req.body)
            console.log("businessLocation",businessLocation)

            return res.status(200).send({
                success: true,
                message: "registered",
                status: 200,
                data: businessLocation
            })
        }
        catch (error) {
            next(error)
        }
    },

    ///////////// get all Business Location /////////////////
    async getAllBusinessLocation(req, res, next) {

        try {
            let filterdata = req.query
            let filter = {}
            if (filterdata.search) {
                filter["$or"] = [{
                    name: {
                        $regex: '.*' + filterdata.search + '.*',
                        $options: 'i',
                    }
                }]
            }
            if (filterdata.status) {
                if (filterdata.status === 'pending') {

                    filter['status'] = 'pending'
                }

                else if (filterdata.status === 'active') {
                    filter["$or"] = [
                        { "status": 'active' },
                        { "status": 'inactive' }
                    ];
                }

            }
            if (filterdata.filter) { // Check if filter query exists

                if (filterdata.status === 'pending') {
                    filter["$and"] = [
                        { "status": { "$eq": "pending" } },
                        {
                            "$or": [
                                { "payment_status": filterdata.filter }
                            ]
                        }
                    ];
                }
                else {
                    filter["$and"] = [
                        { "status": { "$ne": "pending" } },
                        {
                            "$or": [
                                { "payment_status": filterdata.filter }
                            ]
                        }
                    ];
                }


            }

            const options = pick(req.query, ["limit", "page"]);
            let businessLocations = await CrudServices.getList(Jim, filter, options);
            const businessLocationIds = businessLocations.results.map(location => location._id);

            // Fetch packages based on BusinessLocation ID
            // Perform aggregation to fetch packages based on BusinessLocation ID
            const packages = await Packages.aggregate([
                {
                    $match: { BusinessLocation: { $in: businessLocationIds } }
                },
                {
                    $group: {
                        _id: "$BusinessLocation",
                        packageIds: { $push: "$_id" } // Extracting only package IDs
                    }
                }
            ]);

            // Create a map to store packageIds for each BusinessLocation ID
            const packageMap = {};
            packages.forEach(pkg => {
                packageMap[pkg._id.toString()] = pkg.packageIds;
            });

       

            const updateaBusinessLocations = businessLocations.results.map((location)=>(
                {
                   location:location?._doc,
                    packages:  [] // Assign packageIds or an empty array if not found
                }
            ))



            return res.status(200).json({
                success: true,
                message: "ALL users",
                status: 200,
                data: {businessLocations,packages}
            })
        }
        catch (error) {
            console.log(error)
            next(error)
        }
    },


    ///////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////

    ///////////// get single  BusinessLocation /////////////////
    async getOneBusinessLocation(req, res, next) {
        try {
            const JimDetail = await Jim.findOne({ _id: req.query.id })
            return res.status(200).json({
                success: true,
                message: "User Data",
                status: 200,
                data: JimDetail
            })
        }
        catch (error) {
            next(error)
        }
    },
    ///////////// Update Business Location /////////////////
    async updateaBusinessLocation(req, res, next) {
        try {
            const updateLocation = await Jim.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )
            return res.status(200).json({
                success: true,
                message: "User Data",
                status: 200,
                data: updateLocation
            })
        }
        catch (error) {
            next(error)
        }
    },

    ///////////// delete Business Location
    async deleteLocation(req, res, next) {
        try {
            const deleteLocation = await Jim.findByIdAndDelete(req.params.id)
            return res.status(200).send({
                success: true,
                message: "User Deleted",
                status: 200,
                data: deleteLocation
            })
        } catch (err) {
            console.log(err)
        }
    }
}