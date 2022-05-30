import express, { request } from "express"
import { authorize, is_admin } from "../auth/auth.middleware.js";
import {getToken, signIn} from "../auth/auth.microsoft.js";
import { Employee, PendingEmployee } from "./employee.model.js";
import {employeeValidation, multipleemployeeValidation, mevalidation} from "../helpers/schemas.js"
import { find_all_employee, find_pending_employee, find_it_employee, find_trained_employee } from "./employee.service.js";
import { config } from "dotenv";
import sgMail from '@sendgrid/mail'
import fs from 'fs';
import util from 'util';
import { uploadFile} from '../s3upload/s3.js';
import multer from 'multer';
import {spawn} from "child_process";
import fileSystem from "fs";
import fastcsv from "fast-csv";
import "isomorphic-fetch";
import MicrosoftGraph from "@microsoft/microsoft-graph-client";
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
        If you decide to accept this role, your anticipated start date will be ${handleDateChange(emp.doj)} 
         <br/><br/>
         As an employee of Company ABC, you will also have access to our comprehensive benefits program, 
         which includes unlimited vacation days, health insurance, RRSPs and tuition reimbursement.
         To accept this offer, please add your signature <a href="http://localhost:3000/letter/${emp._id}">here</a> by ${handleDateChange(emp.doj)}, and I will get you started with the rest of the onboarding process.
        <br/><br/>
        We are excited about the possibility of you joining Company ABC! <br/>
        If you have any questions, please contact me directly via phone or email.  
        <br/><br/>
        Sincerely,<br/>
        Hiring Manager,
        </p>
    `
}

const microsoftHtml = (emp)=>{
    return `
        <p>Dear ${emp.name},</p>
        <br/>
        <p>
        You have been granted access to our Microsoft Directory. The credentials for the same are shared in this email, you can login the site here by using the following credentials:

        <br/><br/>
            <b>Account Mail:</b> ${emp.mail}
            <br/>
            <b>Password:</b> ${emp.password}
            <br/>
        If you have any questions, please contact me directly via phone or email.  
        <br/><br/>
        Sincerely,<br/>
        Hiring Manager,
        </p>
    `
}
const handleDateChange=(value)=>{
    if(value==null || value==undefined)
    return ""
    const tt = new Date(value*1000)
    let date = tt.getDate()
    let month = tt.getMonth()+1
    let yr = tt.getFullYear()
    return date+"/"+month+"/"+yr
}

router.post('/newemployee', authorize, async (req, res) => {
   // Validate data from req.body
   console.log(req.body)

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
        address: req.body.address,
        trainingRequired: req.body.trainingRequired
    })

    try{
        let single_offer_mail = {
            to: employee.email, // Change to your recipient
            from: 'shwetakale144@gmail.com', // Change to your verified sender
            subject: 'Offer Letter for joining',
            html: offerHtml(employee),          
        }
        sgMail.send(single_offer_mail).then(() => {
            console.log('emails sent successfully!');
        }).catch(error => {
            console.log(error);
        });

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
        if(response.valid.length!=0){
            vldress = await Employee.insertMany(response.valid)
            
            let mul_mail = []
            vldress.forEach((ob)=>{
                let msg = {}
                msg.to = ob.email
                msg.from = 'shwetakale144@gmail.com'
                msg.subject = 'Offer Letter for joining'
                msg.html = offerHtml(ob)
                mul_mail.push(msg)
            })

            sgMail.send(mul_mail).then(() => {
                console.log('emails sent successfully!');
            }).catch(error => {
                console.log(error);
            });

            //console.log(vldress)
        }
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
            var UPN = fName + "_" + lName + "@remotoBE.onmicrosoft.com";

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

const msalRequest = { scopes: [] };
function ensureScope (scope) {
    if (!msalRequest.scopes.some((s) => s.toLowerCase() === scope.toLowerCase())) {
        msalRequest.scopes.push(scope);
    }
}

router.post('/createa', authorize, async(req,res)=>{
    
    const authProvider = {
        getAccessToken: async () => { return req.body.token; }
    };
    const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
    let u = {
        addLicenses: [
          {
            disabledPlans: [],
            skuId: '3b555118-da6a-4418-894f-7df1e2096870'
          }
          
        ],
        removeLicenses: []
    };

    try{
        //find employee whose account is not created

        let emp = await Employee.find({status:'Documents Verified'})
        let mul_mail = []

        // create account of all that employee
        for(let employee of emp){
            var names = (employee.name).split(" ")
            var fName = names[0];
            let user = {
                accountEnabled: true,
                displayName: employee.name,
                mailNickname: fName,
                userPrincipalName: `${fName}@remotoBE.onmicrosoft.com`,
                usageLocation:'US',
                passwordProfile: {
                  forceChangePasswordNextSignIn: true,
                  password: 'xWwvJ]6NMw+bWH-d'
                }
            }
            ensureScope('user.readwrite.all');
            let r = await graphClient.api('/users').post(user);
           // console.log(r)
  
            // add licence
            ensureScope('directory.readwrite.all');
            let g = await graphClient.api(`/users/${fName}@remotoBE.onmicrosoft.com/assignLicense`).post(u);
           // console.log(g)
            
            // send mail to them 
            let ob  = {
                name:employee.name,
                email:employee.email,
                mail: `${fName}@remotoBE.onmicrosoft.com`,
                password: 'xWwvJ]6NMw+bWH-d'
            }
            let msg = {}
            msg.to = employee.email
            msg.from = 'shwetakale144@gmail.com'
            msg.subject = 'Password for Microsoft Account'
            msg.html = microsoftHtml(ob)
            mul_mail.push(msg)

            // Update status to account created
            await Employee.findByIdAndUpdate(employee._id, {status:'Account Created'})
        }   

       if(mul_mail.length!=0){
            sgMail.send(mul_mail).then(() => {
                console.log('emails sent successfully!');
            }).catch(error => {
                console.log(error);
            });
        }
        /*
        const user = {
            accountEnabled: true,
            displayName: 'Test884 One',
            mailNickname: 'Test8',
            userPrincipalName: 'test8@remotoBE.onmicrosoft.com',
            usageLocation:'US',
            passwordProfile: {
              forceChangePasswordNextSignIn: true,
              password: 'xWwvJ]6NMw+bWH-d'
            }
        };

        ensureScope('user.readwrite.all');
        let r = await graphClient.api('/users').post(user);

        ensureScope('directory.readwrite.all');
        await graphClient.api('/users/test8@remotoBE.onmicrosoft.com/assignLicense').post(u);
        */
        res.send({employee: mul_mail})  
    }catch(err){
        console.log(err)
        res.status(400).send({message:err})
    }
})

router.get('/it_employee', authorize, async (req, res)=>{
    try{
        let page = !req.query.page ? 1 : Number(req.query.page);
        let dpp = !req.query.dpp ? 20 : Number(req.query.dpp);
        //let data = await Employee.find({status:"Account Created"})
        let it_employee = await find_it_employee(page, dpp, req.query.type);

        res.send({it_employee: it_employee})
        //console.log(data)
        //res.send(data)
    }catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }
})


router.get('/trained_employee', authorize, async (req, res)=>{
    try{
        let page = !req.query.page ? 1 : Number(req.query.page);
        let dpp = !req.query.dpp ? 20 : Number(req.query.dpp);
        //let data = await Employee.find({status:"Account Created"})
        let trained_employee = await find_trained_employee(page, dpp, req.query.type);
        res.send({trained_employee: trained_employee})
        //console.log(data)
        //res.send(data)
    }catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }
})


router.post('/allocate', authorize, async(req, res)=>{
    try{
        let id = req.body.id 
        console.log(id)
        let emp = await Employee.findByIdAndUpdate(id, {isAllocated: true})
        console.log(emp)
        res.send("Allocated")
    }catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }
} )

router.post('/add-message', authorize, async(req, res)=>{
    try{
        let id = req.body.id 
        await Employee.findByIdAndUpdate(id, {employeeMessage: req.body.employeeMessage})
        let emp = await find_it_employee(1, 20) 
        res.send(emp)
    }catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }
})

router.post('/add-train-message', authorize, async(req, res)=>{
    try{
        let id = req.body.id 
        await Employee.findByIdAndUpdate(id, {trainingMessage: req.body.trainingMessage})
        let emp = await find_trained_employee(1, 20) 
        res.send(emp)
    }catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }
})

router.post('/train', authorize, async(req, res)=>{
    try{
        let id = req.body.id 
        console.log(id)
        let emp = await Employee.findByIdAndUpdate(id, {isTrained: true})
        console.log(emp)
        res.send("Trained")
    }catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }
} )

router.post('/reject_user/:id', async(req,res)=>{
    try{
    let id = req.params.id 
        let emp = await Employee.findByIdAndUpdate(id, {accepted: false, status: "Offer Rejected"})
        console.log(emp)
        res.send("Rejected")
    }catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }
})

router.post('/reject_candidate/:id', async(req,res)=>{
    try{
    let id = req.params.id 
        let emp = await Employee.findByIdAndUpdate(id, {status: "Offer Rejected"})
        console.log(emp)
        res.send("Rejected")
    }catch(err){
        let d = {
            message: err
        }
        res.status(400).send(d)
    }
})

    
 export default router