import express, { request } from "express"
const router = express.Router()
import { authorize } from "../auth/auth.middleware.js";
//import { Employee, PendingEmployee } from "./employee.model.js";
import { User } from "./user.model.js";
import {registerValidation, loginValidation} from "../helpers/schemas.js"

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import sgMail from '@sendgrid/mail'
config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const passwordHtml = (emp, password)=>{
    return `
        <p>Dear ${emp.name},</p>
        <br/>
        <p>
        We are excited to have you onboard. We have created an account for you on our onboarding portal. 
        <br/> The credentials for the same are as follows:
        <br/> <br/>
        Website: http://localhost:3000/signin
        <br/>
        Username: ${emp.email}
        <br/>
        Password: ${password}
        <br/><br/>
        If you have any questions, please contact me directly via phone or email.  
        <br/><br/>
        Sincerely,<br/>
        Hiring Manager,
        </p>
    `
}
router.post('/register', async (req, res) => {
    //res.send('Register')

    // Validate data from req.body
    const {error} = registerValidation(req.body)
    if(error){
        let d = {
            message: error.details[0].message
        }
        return res.status(400).send(d)
    }
    console.log(error)
    //check if user with email exist
    const emailExist = await User.findOne({email: req.body.email})
    let d1 = {
        message: "email already exist"
    }
    if(emailExist) return res.status(400).send(d1)
    console.log(emailExist)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    })

    try{
        const savedUser = await user.save()
        res.send({user: user._id})
    } catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }

 })

 router.post('/login',async (req, res) => {
    //res.send('Login')
     // Validate data from req.body
     const {error} = loginValidation(req.body)
     if(error){
         let d = {
             message: error.details[0].message
         }
        return res.status(400).send(d)
     }
 
     
    //check if user with email does not exist
    const user = await User.findOne({email: req.body.email})
    let d = {
        message: "email or password is wrong"
    }
    if(!user) return res.status(400).send(d)

    // check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    console.log(validPass)
    let d2 = {
        message: 'invalid password'
    }
    if(!validPass) return res.status(400).send(d2)

    
    //create and assign access token
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
    let user_d = {
        _id: user._id,
        role: user.role,
        token: token   
    }
    console.log(user_d)
    res.header('AUTH_TOKEN', token).send(user_d)

})

 router.get('/verify_token', authorize, async(req,res)=>{
    res.send("verified")
 })
/*
 router.put('/reset_password', async(req,res)=>{
     try{
        
     }catch(err){

     }
 })
*/

const randomPass = ()=>{
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 5;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber +1);
    }
    return password
}

router.post('/register_user/:id', async(req,res)=>{

    //  employee information
    console.log(req.body)
    // check if account for employee is already created
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send({
        message: "Account already created"
    })

    let password = randomPass()
    //console.log(password)
    let role = "employee"
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        role: role
    })
    //console.log(user)
    try{
        const savedUser = await user.save()
       // console.log(savedUser)

       let password_mail = {
        to: user.email, // Change to your recipient
        from: 'shwetakale144@gmail.com', // Change to your verified sender
        subject: 'Password for website',
        html: passwordHtml(user,password),          
    }
    sgMail.send(password_mail)
    res.send({user: user._id})
    } catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }

})
export default router

