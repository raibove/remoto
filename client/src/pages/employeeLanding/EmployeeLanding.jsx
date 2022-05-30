import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import {Table, Spin,Tag, Button, Input, notification, Steps} from "antd";

import { signup, getAllEmployee, addEmployee, getEmployee, getEmployeeInfo } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import {useParams} from "react-router-dom"
import store from "../../redux/store";
import { UserOutlined, SolutionOutlined, KeyOutlined, SmileOutlined } from '@ant-design/icons';
import "./EmployeeLanding.css"
const { Step } = Steps;

const EmployeeLanding = (props)=>{
    const [emp,setEmp] = useState(null)
    const [currentStep, setCurrentStep] = useState(null)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
  const columns = [
    {
      title: 'Type',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'View',
      dataIndex: 'link',
      key: 'link',
      render:(text)=>(
        <a href={text} target="_blank">View</a>
      )      
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status =>(
        <>
        {status=="Unverified"?
        <Tag color="red" key={status}>{status}</Tag>:
        <Tag color="green" key={status}>{status}</Tag>
        }
        </>
      )
    }
  ]
  
    let params = useParams();
    const close = () => {
      store.dispatch({ type: "SET_ALERT", payload: { message: null } });
    };
  
    
  const openNotification = (err) => {
    notification["error"]({
      message: "Error in getEmployee",
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
    const tt = new Date(timeStamp*1000)
    let date = tt.getUTCDate()
    let month = tt.getUTCMonth()+1
    let yr = tt.getUTCFullYear()

    return date+"/"+month+"/"+yr
  }

  
useEffect(()=>{
    setLoading(true)
    if(props.employee_info==null){
      props.getEmployeeInfo(params.id)
    }else{
      console.log(props.employee_info)
      if(props.employee_info.data!=undefined){
          let res = props.employee_info.data
        setEmp(res)
        if(res.isAllocated == true){
          if(res.trainingRequired == true){
            if(res.isTrained==true){
              setCurrentStep(3)
            }else{
              setCurrentStep(2)
            }
          }else{
            setCurrentStep(3)
          }
        }else if(res.status=="Account Created"){
          setCurrentStep(2)
        }else if(res.status=="Documents Verified"){
          setCurrentStep(1)
        }else if(res.status=="Offer Accepted"){
          setCurrentStep(0)
        }

        setData([
          {
            key:'1',
            name:'Aadhar Card',
            link: res.adharURL,
            status: res.adharVerified ===true ? 'Verified' : 'Unverified'
          },
          {
            key:'2',
            name:'Pan Card',
            link:res.panURL,
            status: res.panVerified ===true ? 'Verified' : 'Unverified'
          }
        ]) 
      }
    }
    setLoading(false)
  }, [props.employee_info])


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
            <Steps current={currentStep}>
                <Step  title="Offer" description="Offer Accepted & signed."  icon={<UserOutlined />} />
                <Step  title="Verification" icon={<SolutionOutlined />} description="Documentations Uploaded & verified."  />
                <Step  title="Account" icon={<KeyOutlined />} description="Microsoft 365 access granted & gredentials shared on mail"/>
                <Step  title="Done" icon={<SmileOutlined />} description="Training is completed and Welcome Kit is delivered"/>
            </Steps>
            </div>
            <div className="employee-chat-container">
                <div className="employee-chat">
                 <Table size="medium" columns={columns} dataSource={data} pagination={{position:['none', 'none']}}/>
                </div>
                <div className="employee-chat">
                    <p className="it-message"><b>IT Team: </b> {emp.employeeMessage==undefined || emp.employeeMessage==null || emp.employeeMessage==""?<p> No message from IT team</p>: <p>{emp.employeeMessage}</p>}</p>
                    <p className="it-message"><b>Training Team: </b> {emp.trainingMessage==undefined || emp.trainingMessage==null || emp.trainingMessage==""?<p> No message from Training team</p>: <p>{emp.trainingMessage}</p>}</p>
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
    getEmployeeInfo
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
    employee: state.user.employee,
    employee_info: state.user.employee_info
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(EmployeeLanding);
  