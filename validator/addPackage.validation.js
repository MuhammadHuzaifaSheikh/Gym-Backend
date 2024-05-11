const Joi = require('joi');


const updatePackage = Joi.object().keys({
    id: Joi.string().required().label("name"),
    name: Joi.string().required().label("name"),
    description: Joi.string().label("description"),
    price: Joi.string().required().label("price"),
    is_jim_package: Joi.boolean().label("is_jim_package"),
    is_admin_package: Joi.boolean().label("is_jim_package"),
    BusinessLocation: Joi.string().label("BusinessLocation")
});
const addPackage = Joi.object().keys({
    name: Joi.string().required().label("name"),
    description: Joi.string().label("description"),
    user:Joi.string().allow(null,"").label("user"),
    type: Joi.string().label("description"),
    price: Joi.string().required().label("price"),
    is_jim_package: Joi.boolean().label("is_jim_package"),
    is_admin_package: Joi.boolean().label("is_jim_package"),
    BusinessLocation: Joi.string().label("BusinessLocation"),
    customPackageUsers: Joi.array().label("customPackageUsers")
});

module.exports = {
    addPackage,
    updatePackage
};


