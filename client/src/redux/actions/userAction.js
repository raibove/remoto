import axios from "axios";
import api from "../../shared/api"
//import msal from "@azure/msal-browser";
import { PublicClientApplication } from "@azure/msal-browser"
const baseURL = process.env.REACT_APP_BACKEND_URL;


export const signup = (data) => async (dispatch) => {
    try {
      const res = await axios.post(`${baseURL}/users/register`, data);
      await dispatch({
        type: "SUCCESS_DATA",
        payload: "Account created Successfully",
      });
     // localStorage.setItem("dashboard_tour", false);
     window.location="/dashboard"
      return true;
    } catch (e) {
      let message = "Server error";
      console.log(e.response);
      dispatch({ type: "SET_ALERT", payload: { message: e.response} });
      return false;
    }
  };

  export const signin = (data) => async (dispatch) => {
    try {
      const res = await axios.post(`${baseURL}/users/login`, data);
      await dispatch({
        type: "SUCCESS_DATA",
        payload: "Login Success",
      });
      console.log(res)
      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("id", res.data._id)

      if(res.data.role==="employee"){
      window.location.href="/dashboard/"+res.data._id
      }else{
      window.location.href="/dashboard"
      }
  //    return true;
    } catch (e) {
      let message = "Server error";
      console.log(e.response);
      dispatch({ type: "SET_ALERT", payload: { message: e.response} });
      return false;
    }
  };

export const verifyToken = (token)=> async(dispatch) => {
  try{
    const res = await axios.get(`${baseURL}/users/verify_token`)
    return res
  }catch(err){
   // window.location.href = "/signin";
    dispatch({ type: "SET_ALERT", payload: { message: err.response} });
    return err.response
  }
}

export const signout = () => async (dispatch) => {
  localStorage.removeItem("auth_token");
  dispatch({ type: "SET_AUTH", payload: false });
  window.location.href = "/";
};

export const getEmployee = (id)=> async (dispatch)=>{
  try{
    const res = await axios.get(`${baseURL}/users/user/${id}`)
    console.log(res)
    dispatch({type:"GET_EMPLOYEE", payload: {employee: res.data.employee}})
  }catch(err){
    dispatch({type:"SET_ALERT", payload: {message:"Failed to get Employee"}})
  }
}

export const generateCSV = ()=> async(dispatch)=>{
  try{
    const res = await axios.get(`${baseURL}/users/getcsv`)
    console.log(res)
  }catch(err){
    dispatch({type:"SET_ALERT", payload: {message:"Failed to generate CSV"}})
  }
}

export const getAllEmployee = ()=> async (dispatch)=>{
  try{
    const res = await axios.get(`${baseURL}/users/allemployee`)
    console.log(res)
    dispatch({type:"GET_ALL_EMPLOYEE", payload: {all_employee: res.data.all_employee}})
    await dispatch(getPendingEmployee())
  }catch(err){
    dispatch({type:"SET_ALERT", payload: {message:"Failed to get Employee"}})
  }
}

export const getPendingEmployee = ()=> async (dispatch)=>{
  try{
    const res = await axios.get(`${baseURL}/users/pendingemployee`)
    console.log(res)
    dispatch({type:"GET_PENDING_EMPLOYEE", payload: {pending_employee: res.data.pending_employee}})
  }catch(err){
    dispatch({type:"SET_ALERT", payload: {message:"Failed to get Pending Employee"}})
  }
}

export const getSinglePendingEmployee = (id)=> async (dispatch)=>{
  try{
    const res = await axios.get(`${baseURL}/users/pendingemployee/${id}`)
    //console.log(res)
    dispatch({type:"GET_SINGLE_PENDING_EMPLOYEE", payload: {single_pending_employee: res.data.employee}})
  }catch(err){
    console.log(err)
    dispatch({type:"SET_ALERT", payload: {message:"Failed to get Employee"}})
  }
}

export const addEmployee = (data)=> async(dispatch)=>{
  try{
    const res = await axios.post(`${baseURL}/users/newemployee`,data)
    console.log(res)
    await dispatch({
      type: "SUCCESS_DATA",
      payload: "Employee Added",
    });
    await dispatch(getAllEmployee())
    window.location.href = "/employee"
  }catch(err){
    console.log(err)
    dispatch({type:"SET_ALERT", payload: {message:err.response}})
  }
}

export const updateEmployee = (data)=> async(dispatch)=>{
  try{
    const res = await axios.put(`${baseURL}/users/update`, data)
    console.log(res)
  }catch(err){
    console.log(err)
    dispatch({type:"SET_ALERT", payload: {message:err.response}})
  }
}

export const getEmployeeInfo = (id) => async(dispatch)=>{
  try{
    const res = await axios.get(`${baseURL}/users/employee/${id}`)
    console.log(res)
    dispatch({type:"GET_EMPLOYEE_INFO", payload: {employee_info: res}})
  }catch(err){
    console.log(err)
    dispatch({type:"SET_ALERT", payload: {message:err.response}})
  }
}
export const addMultipleEmployee = (data)=> async(dispatch)=>{
  try{
    console.log(data)
    const res = await axios.post(`${baseURL}/users/multipleemployee`,data)
    console.log(res)
    await dispatch({
      type: "SUCCESS_DATA",
      payload: "Employee Added",
    });
    await dispatch(getAllEmployee())
  }catch(err){
    console.log(err)
    dispatch({type:"SET_ALERT", payload: {message:err.response}})
  }
}

export const getLetter = (id)=> async(dispatch)=>{
  try{

    let res = await axios.get(`${baseURL}/users/letter/${id}`)
    console.log(res)
    await dispatch({type: "GET_NEWJOINEE", payload: {newjoinee: res.data.employee}})
    return true
  }catch(err){
    console.log(err)
    dispatch({type:"SET_ALERT", payload: {message:err.response}})
    return false
  }
}

export const registerUser = (id, data)=> async(dispatch)=>{
  try{
    let res = await axios.post(`${baseURL}/users/register_user/${id}`, data)
    console.log(res)
    await dispatch({
      type: "SUCCESS_DATA",
      payload: "Account Created and credentials shared",
    });
    await dispatch(getLetter(id))
  }catch(err){
    console.log(err)
    dispatch({type:"SET_ALERT", payload: {message:err.response}})
  }
}

export const rejectUser = (id)=> async(dispatch)=>{
  try{
    let res = await axios.post(`${baseURL}/users/reject_user/${id}`)
    console.log(res)
    await dispatch({
      type: "SUCCESS_DATA",
      payload: "Offer Rejected",
    });
    await dispatch(getLetter(id))
  }catch(err){
    console.log(err)
    dispatch({type:"SET_ALERT", payload: {message:err.response}})
  }
}
// Microsoft
function ensureScope (scope) {
  if (!msalRequest.scopes.some((s) => s.toLowerCase() === scope.toLowerCase())) {
      msalRequest.scopes.push(scope);
  }
}

async function getToken() {
  let account = sessionStorage.getItem('msalAccount');
  if (!account) {
      throw new Error(
          'User info cleared from session. Please sign out and sign in again.');
  }
  try {
      // First, attempt to get the token silently
      const silentRequest = {
          scopes: msalRequest.scopes,
          account: msalClient.getAccountByUsername(account)
      };

      const silentResult = await msalClient.acquireTokenSilent(silentRequest);
      return silentResult.accessToken;
  } catch (silentError) {
      // If silent requests fails with InteractionRequiredAuthError,
      // attempt to get the token interactively
    //if (silentError instanceof msal.InteractionRequiredAuthError) {  
      if (silentError) {
          const interactiveResult = await msalClient.acquireTokenPopup(msalRequest);
          return interactiveResult.accessToken;
      } else {
          throw silentError;
      }
  }
}


const msalConfig = {
  auth: {
      clientId: 'db29c5ec-6b88-4ce8-b1a4-0c1a6dc4ed05',
      // comment out if you use a multi-tenant AAD app
      authority: 'https://login.microsoftonline.com/common',
      redirectUri: 'http://localhost:3000'
  }
};

//Initialize MSAL client
const msalClient = new PublicClientApplication(msalConfig);


const msalRequest = { scopes: [] };

async function signIn() {
  const authResult = await msalClient.loginPopup(msalRequest);
  sessionStorage.setItem('msalAccount', authResult.account.username);
}

export const createMAccount = ()=> async(dispatch)=>{
  try{
    await signIn();
    let token = await getToken();
    console.log(token);
    let res = await axios.post(`${baseURL}/users/createa`,{token: token})
    // console.log(res)
    return res
  }catch(err){
    console.log(err)
    dispatch({type:"SET_ALERT", payload: {message:"Account Creation failed"}})
    return err
  }
}

export const getItEmployee = (type)=> async(dispatch)=>{
  try{
    let res = await axios.get(`${baseURL}/users/it_employee?type=${type}`)
    console.log(res)
    await dispatch({
      type: "SET_IT_EMPLOYEE",
      payload: {it_employee: res.data.it_employee},
    });
  }catch(err){
    console.log(err)
    dispatch({type:"SET_ALERT", payload: {message:err.response}})
  }
}

export const changeAllocation = (id)=> async(dispatch)=>{
  try{
    console.log(id)
    let res = await axios.post(`${baseURL}/users/allocate`, {id: id})
    console.log(res)
    dispatch(getItEmployee("all"))
  }catch(err){
    console.log(err)
    dispatch({type:"SET_ALERT", payload: {message:err.response}})
  }
}