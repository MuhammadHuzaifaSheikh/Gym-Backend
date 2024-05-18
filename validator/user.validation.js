const Joi = require('joi');
const RegisterUserSchema = Joi.object().keys({
  full_name: Joi.string().required().label("name"),
  email: Joi.string().email().required().label("email"),
  password: Joi.string().optional().label('password'),
  phone: Joi.string().optional().allow(null, ""),
  city: Joi.string().optional().allow(null, ""),
  adress: Joi.string().optional().allow(null, ""),
  images: Joi.string().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
  status: Joi.string().optional().valid("active", "inactive", "blocked","pending"),  
  role: Joi.string().optional(),
  payment_status: Joi.string().optional().valid('paid', 'unpaid'),
  active_date: Joi.date().optional(),
  inActive_date: Joi.date().optional(),
  createdAt: Joi.string().optional().allow(null),
  updatedAt: Joi.string().optional().allow(null),
  __v: Joi.string().optional().allow(null)
});

const Adduser = Joi.object().keys({
    full_name:Joi.string().required().label("name"),
    BusinessLocation:Joi.string().required().label("BusinessLocation"),
    email:Joi.string().email().required().label("email"),
    password: Joi.string().optional().label('password'),
    phone: Joi.string().optional().allow(null,""),
    city: Joi.string().optional().allow(null,""),
    package: Joi.string().optional().allow(null,""),
    adress: Joi.string().optional().allow(null,""),
    images: Joi.string().optional().allow(null,""),
    description: Joi.string().optional().allow(null,""),
    status: Joi.string().optional().valid("active", "inactive", "blocked","pending"),
    role: Joi.string().optional(),
    payment_status: Joi.string().optional().valid('paid', 'unpaid'),
    active_date: Joi.date().optional(),
    inActive_date: Joi.date().optional(),
    // isAdmin: Joi.string().optional().allow(null,""),
    // isJimAdmin: Joi.string().optional().allow(null),
    createdAt: Joi.string().optional().allow(null),
    updatedAt: Joi.string().optional().allow(null),
    __v:Joi.string().optional().allow(null)
  });


  const UpdateUser = Joi.object().keys({
    id:Joi.string().required().label("id"),
    name:Joi.string().label("name"),
    full_name:Joi.string().label("full_name"),
    city:Joi.string().label("city"),
    BusinessLocation:Joi.string().label("BusinessLocation"),
    email:Joi.string().email().label("email"),
    password: Joi.string().label('password'),
    phone: Joi.string().optional().allow(null,""),
    image: Joi.string().optional().allow(null,""),
    status: Joi.string().optional().valid("active", "inactive", "blocked","pending"),
    payment_status: Joi.string().optional().valid('paid', 'unpaid'),
    active_date: Joi.date().optional(),
    inActive_date: Joi.date().optional(),
    // isAdmin: Joi.string().optional().allow(null,""),
    // isJimAdmin: Joi.string().optional().allow(null),
  });

module.exports = { 
    Adduser,
    UpdateUser,
    RegisterUserSchema
};


