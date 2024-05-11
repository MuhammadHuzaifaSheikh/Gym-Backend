const Jim = require("../models/Jim.model");
const { createError } = require("../utils/error");
const User = require("../models/User.model");
const CrudServices = require("../utils/crudServices");
const { pick } = require("../utils/pick");
const { updatePackage, addPackage } = require("../validator/addPackage.validation");
const Packages = require("../models/Packages.model");
const { AddTransaction } = require("./expenses.controller");
const { custom } = require("joi");
require('dotenv').config();

module.exports = {
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////// request to create user /////////////////
    async addPackage(req, res, next) {
        try {
            const { error } = addPackage.validate(req.body);
            if (error) {
                return next(createError(404, error.message))
            }
            const checkPackage = await Packages.findOne({
                name: {
                    $regex: '.*' + req.body.name + '.*',
                    $options: 'i',
                },
                BusinessLocation:req.body.BusinessLocation
            })
            if (checkPackage) {
                return next(createError(404, "A Package with this name already exist"))
            }
            if (req.body.type != "custom") {
                req.body['type'] = "other"
            }
            if (req.body.user){
                req.body['type'] = "custom"
               
                // customPackageUsers
            }

            if(req?.body?.customPackageUserIds){
                req.body['customPackageUsers'] =req?.body?.customPackageUserIds
            }
            if (req.body.is_admin_package ==true) {
                const getpackage = await Packages.findOne({ is_admin_package: true })
                const updatedPackage = await Packages.findOneAndUpdate(
                    { _id: getpackage._id },
                    { $set: req.body },
                    { new: true } 
                );
                return res.status(200).send({
                    success: true,
                    message: "registered",
                    status: 200,
                    data: updatedPackage
                })
            }
            let package = await new Packages(req.body)

           
            await package.save()
            if (req.body.user){
                let data = {
                    id:package._id.toString(),
                    jimId:req.body.BusinessLocation
                }
                let user;
                const getpackage = await Packages.findOne({ _id: data.id })
                if (!getpackage) {
                    return next(createError(404, "Package not found"))
                }
                if (getpackage.is_jim_package && getpackage.BusinessLocation && req.body.user) {
                    user = await User.findById(req.body.user)
                    if (user) {
                        let filteredBusinesslocation = user.BusinessLocation.filter((item) => {
                            let packagelocation = package.BusinessLocation.toString()
                            let userlocation = item.Gym.toString()
                            return item.Gym.toString() !== getpackage.BusinessLocation.toString()
                        })
                        filteredBusinesslocation.push({
                            Gym: getpackage.BusinessLocation,
                            package: getpackage._id.toString()
                        })
                        user["BusinessLocation"] = filteredBusinesslocation
                    } else {
                        return next(createError(404, "User not found"))
                    }
                } else if (getpackage.is_admin_package && data.jimId) {
                    user = await User.findById(req.body.user)
                    let businessLocation = await Jim.findById(data.jimId)
                    if (businessLocation) {
                        businessLocation['package'] = getpackage._id
                        let filteredBusinesslocation = user.BusinessLocation.filter((item) => {
                            return item.Gym.toString() !== getpackage.BusinessLocation
                        })
                        filteredBusinesslocation.push({
                            Gym: getpackage.BusinessLocation,
                            package: getpackage._id.toString()
                        })
                        user["BusinessLocation"] = filteredBusinesslocation
                        businessLocation.save()
                    } else {
                        return next(createError(404, "Gym not found"))
                    }
                }
                await AddTransaction(getpackage._id.toString(), req.body.user, getpackage.BusinessLocation.toString(), next)
                user.save()
            }
            return res.status(200).send({
                success: true,
                message: "registered",
                status: 200,
                data: package
            })
        }
        catch (error) {
            next(error)
        }
    },
    ////////////////////////////////////////////////////
    async getActivePackage(req, res, next) {
        try {
            let user = await User.findById(req.user.id).populate('BusinessLocation.package')
            if (!user) {
                return res.status(200).json({
                    success: true,
                    message: "ALL users",
                    status: 200,
                    data: null
                })
            }
            if (!user.isAdmin) {

                let activegym = req.query.activegym
                let [package] = user.BusinessLocation.filter((pack) => {
                    return pack.Gym.toString() === activegym
                })
                return res.status(200).json({
                    success: true,
                    message: "ALL users",
                    status: 200,
                    data: package.package
                })
            } else {
                let package = await Packages.findOne({
                    is_admin_package: true
                })
                return res.status(200).json({
                    success: true,
                    message: "ALL users",
                    status: 200,
                    data: package
                })
            }
        }
        catch (error) {
            next(error)
        }
    },
    ///////////// get all Business Location /////////////////
    async getPackagesByFilter(req, res, next) {
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
            if (filterdata.is_jim_package == "true") {
                filter['is_jim_package'] = true
            }
            if (filterdata.BusinessLocation) {
                filter['BusinessLocation'] = filterdata.BusinessLocation
            }
            if (filterdata.is_admin_package == "true") {
                filter['is_admin_package'] = true
            }
            if (filterdata.type) {
                filter['type'] = filterdata.type
            }

            const options = pick(req.query, ["limit", "page"]);
            const businessLocation = await CrudServices.getList(Packages, filter, options)
            return res.status(200).json({
                success: true,
                message: "ALL users",
                status: 200,
                data: businessLocation
            })
        }
        catch (error) {
            next(error)
        }
    },
    ///////////////////////////////////////////////////////////////////////////////////

    ///////////// get single  BusinessLocation /////////////////
    async subscribePackage(req, res, next) {
        try {
            let data = req.body
            let user;
            const package = await Packages.findOne({ _id: data.id })
            if (!package) {
                return next(createError(404, "Package not found"))
            }
            if (package.is_jim_package && package.BusinessLocation && req.user.id) {
                user = await User.findById(req.user.id)
                if (user) {
                    let filteredBusinesslocation = user.BusinessLocation.filter((item) => {
                        let packagelocation = package.BusinessLocation.toString()
                        let userlocation = item.Gym.toString()
                        return item.Gym.toString() !== package.BusinessLocation.toString()
                    })
                    filteredBusinesslocation.push({
                        Gym: package.BusinessLocation,
                        package: package._id.toString()
                    })
                    user["BusinessLocation"] = filteredBusinesslocation
                } else {
                    return next(createError(404, "User not found"))
                }
            } else if (package.is_admin_package && data.jimId) {
                user = await User.findById(req.user.id)
                let businessLocation = await Jim.findById(data.jimId)
                if (businessLocation) {
                    businessLocation['package'] = package._id
                    let filteredBusinesslocation = user.BusinessLocation.filter((item) => {
                        return item.Gym.toString() !== package.BusinessLocation
                    })
                    filteredBusinesslocation.push({
                        Gym: package.BusinessLocation,
                        package: package._id.toString()
                    })
                    user["BusinessLocation"] = filteredBusinesslocation
                    businessLocation.save()
                } else {
                    return next(createError(404, "Gym not found"))
                }
            }
            await AddTransaction(package._id.toString(), req.user.id, package.BusinessLocation.toString(), next)
            user.save()
            return res.status(200).json({
                success: true,
                message: "User Data",
                status: 200,
                data: true
            })
        }
        catch (error) {
            next(error)
        }
    },
    ///////////// Update Business Location /////////////////
    async updatePackages(req, res, next) {
        try {
            const { error } = updatePackage.validate(req.body);
            if (error) {
                return next(createError(404, error.message))
            }
            const package = await Packages.findOneAndUpdate(
                { _id: req.body.id },
                { $set: req.body },
                { new: true }
            )
            return res.status(200).json({
                success: true,
                message: "User Data",
                status: 200,
                data: package
            })
        }
        catch (error) {
            next(error)
        }
    },

    ///////////// delete Business Location
    async deletePackage(req, res, next) {
        try {
            const package = await Packages.findByIdAndDelete(req.query.id)
            return res.status(200).send({
                success: true,
                message: "User Deleted",
                status: 200,
                data: true
            })
        } catch (err) {
            console.log(err)
        }
    }
}