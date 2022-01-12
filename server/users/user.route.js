import express, { request } from "express"
const router = express.Router()

import { User } from "./user.model.js";
import {registerValidation, loginValidation} from "../helpers/schemas.js"

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    //check if user with email exist
    const emailExist = await User.findOne({email: req.body.email})
    let d1 = {
        message: "email already exist"
    }
    if(emailExist) return res.status(400).send(d1)
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
    res.header('AUTH_TOKEN', token).send(user_d)

})

export default router

