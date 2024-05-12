const Joi = require('joi');


const AddJIM = Joi.object().keys({
    full_name:Joi.string().required().label("full_name"),
    email:Joi.string().email().required().label("email"),
    password: Joi.string().required().label('password'),
    phone: Joi.string().optional().allow(null,""),
    images: Joi.array().optional().allow(null,""),
    gymName: Joi.string().optional().allow(null,""),
    gymAddress: Joi.string().optional().allow(null,""),
    adress: Joi.string().optional().allow(null,""),
    package: Joi.string().optional().allow(null,""),
    city: Joi.string().optional().allow(null,""),
    description: Joi.string().optional().allow(null,""),
    status: Joi.string().optional().valid('active', 'archived',"pending","inactive"),
  });
  const UpdateJim = Joi.object().keys({
    id:Joi.string().required().label("id"),
    name:Joi.string().required().label("name"),
    BusinessLocation:Joi.string().required().label("BusinessLocation"),
    email:Joi.string().email().required().label("email"),
    password: Joi.string().required().label('password'),
    phone: Joi.string().optional().allow(null,""),
    image: Joi.string().optional().allow(null,""),
    status: Joi.string().optional().valid('active', 'archived',"pending","inactive"),
    active_date: Joi.date().optional(),
    inActive_date: Joi.date().optional(),
    // isAdmin: Joi.string().optional().allow(null,""),
    // isJimAdmin: Joi.string().optional().allow(null),
    // created_at: Joi.string().optional().allow(null)
  });

module.exports = { 
    AddJIM,
    UpdateJim
};


