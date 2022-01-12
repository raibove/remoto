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