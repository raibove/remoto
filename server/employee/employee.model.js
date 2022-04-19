/**
 * 
 * name
 * mail
 * career 
 * status - offer send, accpted, rejected, document verified, uploaded, pending
 * accepted - offer letter
 * salary
 * timestamp
 * joining date - UNIX
 * 
 */

import mongoose from "mongoose"
const Schema = mongoose.Schema;

const employee_schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        career: {
            type: String,
            required: true,
        },
        doj:{
            type:Number,
            required: true
        },
        status:{
            type: String,
            default: "Offer Send"
        },
        accepted:{
            type:Boolean,
        },
        adharURL:{
            type:String
        },
        panURL:{
            type:String
        },
        adharNo:{
            type: String
        },
        panNo:{
            type: String
        },
        panVerified:{
            type:Boolean,
            default:false
        },
        adharVerified:{
            type:Boolean,
            default:false
        },
        address:{
            type:String,
            required: true,
        },
        trainingRequired:{
            type:Boolean,
            required: true,
        },
        isAllocated:{
            type:Boolean,
            default:false
        },
        isTrained:{
            type:Boolean
        }
    },
    {
        timestamps: true,
    }
)

const pending_employee_schema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        career: {
            type: String,
        },
        doj:{
            type:Date,
        },
        status:{
            type: String,
            default: "Offer Letter Pending"
        },
        accepted:{
            type:Boolean
        },
        error_msg:{
            type:String
        }
    },
    {
        timestamps: true,
    }
)
export const Employee = mongoose.model("Employee", employee_schema)
export const PendingEmployee = mongoose.model("PendingEmployee", pending_employee_schema)