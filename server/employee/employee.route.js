import express, { request } from "express"
import { authorize, is_admin } from "../auth/auth.middleware.js";

import { Employee, PendingEmployee } from "./employee.model.js";
import {employeeValidation, multipleemployeeValidation, mevalidation} from "../helpers/schemas.js"
import { find_all_employee, find_pending_employee } from "./employee.service.js";
import { config } from "dotenv";
import sgMail from '@sendgrid/mail'
import fs from 'fs';
import util from 'util';
import { uploadFile} from '../s3upload/s3.js';
import multer from 'multer';
import {spawn} from "child_process";
import fileSystem from "fs";
import fastcsv from "fast-csv";
const unlinkFile = util.promisify(fs.unlink)
const upload = multer({ dest: 'uploads/' })

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
         To accept this offer, please add your signatur <a href="http://localhost:3000/letter/${emp._id}">here</a> by ${emp.doj}, and I will get you started with the rest of the onboarding process.
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
        let single_offer_mail = {
            to: employee.email, // Change to your recipient
            from: 'shwetakale144@gmail.com', // Change to your verified sender
            subject: 'Offer Letter for joining',
            html: offerHtml(employee),          
        }
        sgMail.send(single_offer_mail) 
        const savedUser = await employee.save()
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

router.get('/pendingemployee/:id', authorize, async(req,res) => {
    try{
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) 
            throw "Not valid object id"
        var user = await PendingEmployee.findById(req.params.id);
        if (!user) {
            throw "Can't find employee";
        }
        res.send({employee:user});
    }catch(err){
        res.status(400).send({message:err})
    }  
})

 router.post('/multipleemployee', authorize, async(req,res) => {
    let response = mevalidation(req.body)
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
        res.status(400).send({message:"duplicate data present"})
   }
 })

 router.get('/user/:id', authorize, async(req,res)=> {
    try{
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) 
            throw "Not valid object id"
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
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) 
            throw "Not valid object id"
        var user = await Employee.findById(req.params.id);
        if (!user) {
            throw "Can't find employee";
        }
        res.send({employee:user});
    }catch(err){
        console.log(err)
        res.status(400).send({message:err})
    }   
 })

router.post('/images', authorize, upload.single('image'), async (req, res) => {
    try{
    const file = req.file
    console.log(file)
    // apply filter resize   
    const result = await uploadFile(file)
    await unlinkFile(file.path)
    const description = req.body.description
    console.log(description)
    if(description==="pan"){
        console.log("in pan")
        var process = spawn('python',["./panTesting.py", result.Location] );
        process.stdout.on('data',function(data){
            console.log(data)
            const details = JSON.stringify((data.toString()).split(/\r?\n/))
	        console.log(details)
            //data.imagePath = result.Location
            //console.log(data)
            res.send(details);
        });
    }else{
        console.log("in adhar")
        var process = spawn('python',["./adharTesting.py", result.Location] );
        process.stdout.on('data',function(data){
            const details = JSON.stringify((data.toString()).split(/\r?\n/))
		console.log(details)
           //data.imagePath = result.Location
            res.send(details);
        });
    }   
    //res.send({imagePath: `${result.Location}`})
    }catch(err){
        res.status(400).send({message:err})
    }
})

router.get('/getcsv', authorize, async (req,res)=>{
    try{
        let data =  await Employee.find()
        let requiredData = []
        data.forEach(function(row){

            var fullName = row["name"];
            var names = fullName.split(" ")
            var fName = names[0];
            var lName = names[1];
            var email = row["email"];
            var displayName = fullName;
            var usageLocation = "Pune";
            var job = row["career"];
            var UPN = fName + "_" + lName + "@remoto.onmicrosoft.com";

            requiredData.push(
                {
                    "Username"                : UPN,
                    "First name"              : fName,
                    "Last name"               : lName,
                    "Display name"            : displayName,
                    "Job title"               : job,
                    "Alternate email address" : email,
                    "Usage location"          : usageLocation
                }
            );
        });

        var ws = fileSystem.createWriteStream("public/data.csv");
        fastcsv
            .write(requiredData, { headers: true })
            .on("finish", function() {

            res.send("Send");
            })
            .pipe(ws);

    }catch(e){
        res.status(400).send({message:e})
    }
})
        /*
        var csv = 'ID,Name,Email,Password\n';  
          
        data.forEach(function(row){  
                csv += row["_id"] + "," + row["name"] + "," + row["email"] + "," + row["password"];
                csv += "\n";  
        });  
        var hiddenElement = document.createElement('a');  
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
        hiddenElement.target = '_blank';  
              
        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = 'Famous Personalities.csv';  
        hiddenElement.click(); 
            */
//router.get('/stats', authorize, )
 export default router