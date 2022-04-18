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

export const find_it_employee = async(page, document_per_page)=>{
    let it_employee = await paginate(Employee, {status:"Account Created"}, page, document_per_page)
    return it_employee;
}