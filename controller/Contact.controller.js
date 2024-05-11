const ContachQuery = require("../models/contactQuery.model");
const User = require("../models/User.model");
const CrudServices = require("../utils/crudServices");
const { pick } = require("../utils/pick");

const addContactQuery = async (req, res, next) => {
    try {
        let data = req.body
        if (data.user) {
            data['submitted_by'] = "gym"
            const user = await User.findById(data.user)
            data['name'] = user.full_name
            data['email'] = user.email
        } else {
            data['submitted_by'] = "user"
        }
        if (!data) {
            return next(createError(404, "User not found"));
        }
        let contact = await new ContachQuery(req.body)
        await contact.save()

        return res.status(200).send({
            success: true,
            message: "Monthly earnings retrieved successfully",
            data: contact
        });

    } catch (err) {
        return next(err);
    }
}
const getContactQuery = async (req, res, next) => {
    try {
        let filter = {}
        const options = pick(req.query, ["limit", "page"]);
        const contact = await CrudServices.getList(ContachQuery, filter, options)
        return res.status(200).send({
            success: true,
            message: "Monthly earnings retrieved successfully",
            data: contact
        });

    } catch (err) {
        return next(err);
    }
}
const deleteContactQuery = async (req, res, next) => {
    try {
        if (!req.query.id) {
            return next(createError(404, "User not found"));

        }
        await ContachQuery.findByIdAndDelete(req.query.id)
        return res.status(200).send({
            success: true,
            message: "Monthly earnings retrieved successfully",
            data: true
        });

    } catch (err) {
        return next(err);
    }
}
module.exports = {
    addContactQuery,
    getContactQuery,
    deleteContactQuery
}