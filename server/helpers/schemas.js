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
    //console.log(employee_schema)
    return employee_schema.validate(data)
}

export const multipleemployeeValidation = data=>{
    const employee_schema =  Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        career: Joi.string().required(),
        accepted: Joi.boolean(),
        status: Joi.string(),
        doj: Joi.date().required() 
    })

    const multiple_employee_schema = Joi.array().items(employee_schema)

    return multiple_employee_schema.validate(data)
}

export const mevalidation = data=>{
    const employee_schema =  Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        career: Joi.string().required(),
        accepted: Joi.boolean(),
        status: Joi.string(),
        doj: Joi.date().required() 
    })
    let vld = []
    let unvld = []
    data.forEach((d)=>{
        let result = employee_schema.validate(d)
       // console.log(result)
        if(result.error){
            console.log("error")
            console.log(result.error.details[0].message)
            let tmp = d
            tmp.error_msg = result.error.details[0].message
            unvld.push(tmp)
        }else{
            //console.log("pass")
            vld.push(d)
        }
    })

    let ans = {
        valid: vld,
        invalid: unvld
    }

    return ans
}