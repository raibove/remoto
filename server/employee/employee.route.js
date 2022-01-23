import express, { request } from "express"
import { authorize } from "../auth/auth.middleware.js";

import { Employee, PendingEmployee } from "./employee.model.js";
import {employeeValidation, multipleemployeeValidation, mevalidation} from "../helpers/schemas.js"
import { find_all_employee } from "./employee.service.js";

const router = express.Router()

const dd = [
    {
        name:"aaa",
        email:"aab@gmail.com",
        career:"aaa",
        doj:1642870643  
    },{
        name:"bbb",
        email:"bbb",
        career:"aaa",
        doj:1642870643  
    },{
        name:"",
        email:"ccd@gmail.com",
        career:"aaa",
        doj:1642870643  
    },{
        name:"ddd",
        email:"dde@gmail.com",
        career:"aaa",
        doj:1642870643  
    }
]

router.post('/newemployee', async (req, res) => {
    console.log(req.body)
    // Validate data from req.body
    const {error} = employeeValidation(req.body)
    if(error){
        let d = {
            message: error.details[0].message
        }
        return res.status(400).send(d)
    }
    console.log(error)
    //check if user with email exist
    const emailExist = await Employee.findOne({email: req.body.email})
    let d1 = {
        message: "email already exist"
    }
    if(emailExist) return res.status(400).send(d1)
    console.log(emailExist)
    const employee = new Employee({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        doj: req.body.doj,
        career:req.body.career,
        status: req.body.career
    })

    try{
        const savedUser = await employee.save()
        res.send({employee: employee._id})
    } catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }

 })


 router.get('/allemployee',  async(req,res) =>{
    let page = !req.query.page ? 1 : Number(req.query.page);
    let dpp = !req.query.dpp ? 20 : Number(req.query.dpp);
    try{
    let all_employee = await find_all_employee(page, dpp)
    res.send({all_employee: all_employee})
    //console.log(all_employee)
    }catch(err){
        console.log(err)
        let d = {
            message: err
        }
        res.status(400).send(d)
    }

 })

 router.post('/multipleemployee', async(req,res) => {
    let response = mevalidation(req.body)
    //console.log(response)
    //res.send(response)
    let vldress = [], unvldress = []
   try{
    vldress = await Employee.insertMany(response.valid)
    unvldress = await PendingEmployee.insertMany(response.invalid)
    console.log(unvldress)
    console.log(vldress)
    
    let data = {
        valid: vldress,
        unvalid: unvldress
    }
res.send(data)
   }catch(err){
     //  console.log(err.writeErrors)
       if(err.code===11000){
           console.log("duplicate data present")
           res.status(404).send({message:"duplicate data present"})
       }
       res.status(404).send({message:"couldn't add Valid data"})
   }
 })


 export default router