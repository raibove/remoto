import Joi from "Joi"

export const registerValidation = data => {
    const user_schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        role: Joi.string().required(),
        password: Joi.string().required(),
    })

    return user_schema.validate(data)
}

export const loginValidation = data => {
    const user_schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })

    return user_schema.validate(data)
}

export const employeeValidation = data => {
    const employee_schema = Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        career: Joi.string().required(),
        accepted: Joi.boolean(),
        status: Joi.string(),
        doj: Joi.date().required() 
    })

    return employee_schema.validate(data)
}