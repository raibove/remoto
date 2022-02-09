import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import {Table, Tag, Upload, Tabs, message, notification,Button} from "antd";
import {Link} from "react-router-dom"
import { signup, getAllEmployee,addMultipleEmployee, getPendingEmployee } from "../../redux/actions/userAction";
import { connect } from "react-redux"
import store from "../../redux/store";
import xlsx from "xlsx"
import "./Account.css"

const Account = (props)=>{
  
    return(
        <>
        <SideBar/>
        <div className="account-microsoft-container">
            <a href="https://admin.microsoft.com/AdminPortal/Home?#/users/:/adduser">
            <Button type="primary" className="account-microsoft-add">
                Add a User
            </Button>
            </a>
            <a href="https://admin.microsoft.com/AdminPortal/Home?#/users/:/addmultipleusers">
            <Button type="primary" className="account-microsoft-add">
                Add Multiple User
            </Button>
            </a>
            <a href="https://account.activedirectory.windowsazure.com/UserManagement/MultifactorVerification.aspx?BrandContextID=O365">
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
    addMultipleEmployee,
    getPendingEmployee,
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
    pending_employee: state.user.pending_employee,
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(Account);
  