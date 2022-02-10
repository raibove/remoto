import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import {Table, Spin,Tag, Button, Input, notification, Steps} from "antd";

import { signup, getAllEmployee, addEmployee, getEmployee } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import {useParams} from "react-router-dom"
import store from "../../redux/store";
import "./Employee.css"
import { UserOutlined, SolutionOutlined, KeyOutlined, SmileOutlined } from '@ant-design/icons';

const { Step } = Steps;

const SingleEmployee = (props)=>{
    const [emp,setEmp] = useState(null)

    let params = useParams();
    const close = () => {
      store.dispatch({ type: "SET_ALERT", payload: { message: null } });
    };
  
    
  const openNotification = (err) => {
    notification["error"]({
      message: "Error in signup",
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

  const timeConverter = (timeStamp)=>{
    console.log(timeStamp)
    const tt = new Date(timeStamp)
    let date = tt.getUTCDate()
    let month = tt.getUTCMonth()
    let yr = tt.getUTCFullYear()

    return date+"/"+month+"/"+yr
  }

  useEffect(()=>{
      if(props.employee === null){
          props.getEmployee(params.id)
      }else{
          let re = props.employee
          console.log(re)
          setEmp(props.employee)
      }
  },[props.employee])

    return(
        <>
        <SideBar/>
        {emp===null? <Spin size="large"></Spin>:
        <div className="single-employee-container">
            .
            <div className="employee-info-container">
                <p>Name: {emp.name}</p>
                <p>Email: {emp.email}</p>
                <p>Role: {emp.career}</p>
                <p>Date of Joining: {timeConverter(emp.doj)}</p>
            </div>
            <div  className="employee-info-container">
            <Steps>
                <Step status="finish" title="Offer" description="Offer Accepted & signed."  icon={<UserOutlined />} />
                <Step status="finish" title="Verification" icon={<SolutionOutlined />} description="Documentations Uploaded & verified."  />
                <Step status="wait" title="Account" icon={<KeyOutlined />} />
                <Step status="wait" title="Done" icon={<SmileOutlined />} />
            </Steps>
            </div>
            <div className="employee-chat-container">
                <div className="employee-chat">

                </div>
                <div className="employee-chat">
                    
                </div>
            </div>
        </div>
        }
        </>
    )
}

const mapActionWithProps = {
    signup,
    getAllEmployee,
    addEmployee,
    getEmployee,
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
    employee: state.user.employee,

  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(SingleEmployee);
  