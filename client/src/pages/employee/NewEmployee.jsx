import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import {Table, Tag, Button, Input, notification, DatePicker, Radio} from "antd";

import { signup, getAllEmployee, addEmployee } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import store from "../../redux/store";
import "./Employee.css"
const {Column} = Table
const {TextArea} = Input
const Employee = (props)=>{
    const [empName, setEmpName] = useState("");
    const [empMail, setEmpMail] = useState("")
    const [empRole, setEmpRole] = useState("")
    const [empDoj, setEmpDoj] = useState("") 
    const [empAddress, setEmpAddress] = useState("");
    const [empLoading, setEmpLoading] = useState(false)
    const [empTraining, setEmpTraining] = useState()

    const onAddEmployee = async ()=>{
      setEmpLoading(true)
      let data = {
        name: empName,
        email: empMail,
        doj: empDoj,
        career: empRole,
        address: empAddress,
        trainingRequired: empTraining 
      }
      console.log(data)
      try{
        const res = await props.addEmployee(data)
        console.log(res)
      }catch(e){
        console.log(e)
      }
      setEmpLoading(false)
    }

  const close = () => {
    store.dispatch({ type: "SET_ALERT", payload: { message: null } });
  };
  
    
  const openNotification = (err) => {
    notification["error"]({
      message: "Error in newEmployee",
      description: err.message,
      onClose: close,
    });
  };

  useEffect(() => {
    if (props.alert_message !== null && props.alert_message!= undefined) {
      openNotification(props.alert_message.data);
     console.log(props.alert_message.data)
    }
  }, [props.alert_message]);


  const handleDateChange=(value)=>{
      console.log(value)
      let d = new Date(value)
      console.log(Math.floor(d.getTime()/1000))
      setEmpDoj(Math.floor(d.getTime()/1000))
  }
  return(
      <>
      <SideBar/>
      <div className="wrapper">
      <div className="new-employee-container">
        <div className="new-employee-title">
          <h3>Name</h3>
          <Input className="new-employee-input" value={empName} onChange={(e)=>{
            setEmpName(e.target.value)
          }} size="large" placeholder="enter employee name" />
        </div>
        <div className="new-employee-title">
          <h3>Email</h3>
          <Input className="new-employee-input" value={empMail} onChange={(e)=>{
            setEmpMail(e.target.value)
          }}size="large" placeholder="enter employee email" />
        </div>
        <div className="new-employee-title">
          <h3>Role</h3>
          <Input className="new-employee-input" value={empRole} onChange={(e)=>{
            setEmpRole(e.target.value)
          }} size="large" placeholder="enter role name" />
        </div>
        <div className="new-employee-title">
          <h3>Address</h3>
          <TextArea rows={4} placeholder="Enter address" onChange={(e)=> {
            setEmpAddress(e.target.value)
          }}/>
        </div>
        <div className="new-employee-title">
          <h3>Date of Joining</h3>
          <DatePicker onChange={handleDateChange} format='DD/MM/YYYY'/>
        </div>
        <div className="new-employee-title">
          <h3>Training Required</h3>
          <Radio.Group buttonStyle="solid" onChange={(e)=>{
            setEmpTraining(e.target.value)
          }}>
            <Radio.Button value={true}>Yes</Radio.Button>
            <Radio.Button value={false}>No</Radio.Button>
          </Radio.Group>
        </div>
        <Button type="primary" className="emp-button" loading={empLoading} onClick={onAddEmployee}>Add Employee</Button>
      </div>
      </div>
      </>
  )
}

const mapActionWithProps = {
    signup,
    getAllEmployee,
    addEmployee
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(Employee);
  