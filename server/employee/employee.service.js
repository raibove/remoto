import {Employee} from "./employee.model.js"
import { paginate } from '../helpers/paginate.js';

export const find_all_employee = async (page, document_per_page)=>{
    let all_employee = await paginate(Employee, {}, page, document_per_page)
    return all_employee;
}