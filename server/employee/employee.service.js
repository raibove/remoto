import {Employee, PendingEmployee} from "./employee.model.js"
import { paginate } from '../helpers/paginate.js';

export const find_all_employee = async (page, document_per_page)=>{
    let all_employee = await paginate(Employee, {}, page, document_per_page)
    return all_employee;
}

export const find_pending_employee = async (page, document_per_page)=>{
    let pending_employee = await paginate(PendingEmployee, {}, page, document_per_page)
    return pending_employee;
}

export const find_it_employee = async(page, document_per_page, type)=>{
    let it_employee;
    if(type==="allocated")
        it_employee = await paginate(Employee, {status:"Account Created", isAllocated:true}, page, document_per_page)
    else if(type==="pending")
        it_employee = await paginate(Employee, {status: "Account Created", isAllocated:false}, page, document_per_page)
    else
        it_employee = await paginate(Employee, {status:"Account Created"}, page, document_per_page)

    return it_employee;
}

export const find_trained_employee = async(page, document_per_page, type)=>{
    let trained_employee;
    if(type==="trained")
    trained_employee = await paginate(Employee, {status:"Account Created", trainingRequired: true, isTrained:true}, page, document_per_page)
    else if(type==="pending")
    trained_employee = await paginate(Employee, {status: "Account Created",  trainingRequired: true, isTrained:false}, page, document_per_page)
    else
    trained_employee = await paginate(Employee, {status:"Account Created",  trainingRequired: true,}, page, document_per_page)

    return trained_employee;
}
