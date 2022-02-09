import express, { request } from "express"
import { authorize, is_admin } from "../auth/auth.middleware.js";

import { Employee, PendingEmployee } from "./employee.model.js";
import {employeeValidation, multipleemployeeValidation, mevalidation} from "../helpers/schemas.js"
import { find_all_employee, find_pending_employee } from "./employee.service.js";
import { config } from "dotenv";
import sgMail from '@sendgrid/mail'
config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const router = express.Router()


const offerHtml = (emp)=>{
    return `
        <p>Dear ${emp.name},</p>
        <br/>
        <p>
         We are excited to offer you a full-time position as a ${emp.career} at our Company. We look
         forward to work with you.
         <br/>
         As per our discussion we’d like to offer you an annual starting salary of $60,000 paid out on your account.
        <br/>
        If you decide to accept this role, your anticipated start date will be ${emp.doj} 
         <br/><br/>
         As an employee of Company ABC, you will also have access to our comprehensive benefits program, 
         which includes unlimited vacation days, health insurance, RRSPs and tuition reimbursement.
         To accept this offer, please email me at shwetakale144@gmail.com by ${emp.doj}, and I will get you started with the rest of the onboarding process.
        <br/><br/>
        We are excited about the possibility of you joining Company ABC! <br/>
        If you have any questions, please contact me directly via phone or email.  
        <br/><br/>
        Sincerely,<br/>
        Hiring Manager,
        </p>
    `
}

router.post('/newemployee', authorize, async (req, res) => {
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
   const employee = new Employee({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        doj: req.body.doj,
        career:req.body.career,
    })

    try{
        const savedUser = await employee.save()
        let single_offer_mail = {
            to: employee.email, // Change to your recipient
            from: 'shwetakale144@gmail.com', // Change to your verified sender
            subject: 'Offer Letter for joining',
            html: offerHtml(employee),          
        }
        sgMail.send(single_offer_mail) 
        .then(() => {
            console.log('Email sent')
          })
          .catch((error) => {
            console.error(error)
          })

        res.send({employee: employee._id})
    } catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }

 })


 router.get('/allemployee', authorize,is_admin, async(req,res) =>{
    let page = !req.query.page ? 1 : Number(req.query.page);
    let dpp = !req.query.dpp ? 20 : Number(req.query.dpp);
    try{
    let all_employee = await find_all_employee(page, dpp)
    res.send({all_employee: all_employee})
    }catch(err){
        console.log(err)
        let d = {
            message: err
        }
        res.status(400).send(d)
    }
 })

 
 router.get('/pendingemployee', authorize, async(req,res) =>{
    let page = !req.query.page ? 1 : Number(req.query.page);
    let dpp = !req.query.dpp ? 20 : Number(req.query.dpp);
    try{
    let pending_employee = await find_pending_employee(page, dpp)
    res.send({pending_employee: pending_employee})
    
    }catch(err){
        console.log(err)
        let d = {
            message: err
        }
        res.status(400).send(d)
    }
 })

 router.post('/multipleemployee', authorize, async(req,res) => {
    let response = mevalidation(req.body)
    //res.send(response)
    let vldress = [], unvldress = []
    
   try{
        if(response.valid.length!=0)
            vldress = await Employee.insertMany(response.valid)
        if(response.invalid.length!=0)
            unvldress = await PendingEmployee.insertMany(response.invalid)
    
    let data = {
        valid: vldress,
        unvalid: unvldress
    }
res.send(data)
   }catch(err){
     //  console.log(err.writeErrors)
       //if(err.code===11000){
         //  console.log("duplicate data present")
           res.status(400).send({message:"duplicate data present"})
       //}
    //   res.status(404).send({message:"couldn't add Valid data"})
   }
 })

 router.get('/user/:id', authorize, async(req,res)=> {
    try{
        var user = await Employee.findById(req.params.id);
        if (!user) {
            throw "Can't find employee";
        }
        res.send({employee:user});
    }catch(err){
        res.status(400).send({message:err})
    }    
 })

 router.get('/letter/:id', async(req,res)=>{
    try{
        var user = await Employee.findById(req.params.id);
        if (!user) {
            throw "Can't find employee";
        }
        res.send({employee:user});
    }catch(err){
        res.status(400).send({message:err})
    }   
 })

 export default router