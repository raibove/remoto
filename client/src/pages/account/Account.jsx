import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import {Table, Tag, Upload, Tabs, message, notification,Button} from "antd";
import {Link} from "react-router-dom"
import { signup, getAllEmployee, getPendingEmployee, generateCSV, createMAccount } from "../../redux/actions/userAction";
import { connect } from "react-redux"
import store from "../../redux/store";
import mButton from "../../assets/img/ms-signin.png"
import xlsx from "xlsx"
import "./Account.css"

const Account = (props)=>{
  
    const createCSV = async ()=>{
        await props.generateCSV();
    }
    return(
        <>
        <script src="https://alcdn.msauth.net/browser/2.1.0/js/msal-browser.min.js"
            integrity="sha384-EmYPwkfj+VVmL1brMS1h6jUztl4QMS8Qq8xlZNgIT/luzg7MAzDVrRa2JxbNmk/e"
            crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/@microsoft/microsoft-graph-client/lib/graph-js-sdk.js"></script>
        
        <SideBar/>
        <div className="account-microsoft-container">
            <Button onClick={()=>{createMAccount()}}>Microsoft</Button>
            <div onClick={()=>{createMAccount()}}>
                <img src={mButton} alt="Signin with Microsoft"/>
            </div>
            <Button type="primary" className="account-microsoft-add" onClick={()=>{createCSV()}}>
                Create CSV
            </Button>
            <a href="https://admin.microsoft.com/AdminPortal/Home?#/users/:/adduser" target="_blank">
            <Button type="primary" className="account-microsoft-add">
                Add a User
            </Button>
            </a>
            <a href="https://admin.microsoft.com/AdminPortal/Home?#/users/:/addmultipleusers" target="_blank">
            <Button type="primary" className="account-microsoft-add">
                Add Multiple User
            </Button>
            </a>
            <a href="https://account.activedirectory.windowsazure.com/UserManagement/MultifactorVerification.aspx?BrandContextID=O365" target="_blank">
            <Button type="primary" className="account-microsoft-add">
                Add Multifactor Authentication
            </Button>
            </a>
            <a href="https://admin.microsoft.com/AdminPortal/Home?#/users/:/DeleteUser"   target="_blank" >
            <Button type="primary" className="account-microsoft-add">
                Delete User
            </Button>
            </a>
        </div>
        <div>
        </div>
        </>
    )
}

const mapActionWithProps = {
    signup,
    getAllEmployee,
    getPendingEmployee,
    generateCSV,
    createMAccount
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
    pending_employee: state.user.pending_employee,
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(Account);
  