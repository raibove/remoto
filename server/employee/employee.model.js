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
            type:Date,
            required: true
        },
        status:{
            type: String,
            default: "Offer Send"
        },
        accepted:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps: true,
    }
)

export const Employee = mongoose.model("Employee", employee_schema)