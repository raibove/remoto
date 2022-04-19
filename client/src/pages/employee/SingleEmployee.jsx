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
    const [currentStep, setCurrentStep] = useState(null)
      
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

  const data= [
    {
      key:'1',
      name:'Aadhar Card',
      link: emp.adharURL,
      status: emp.adharVerified ===true ? 'Verified' : 'Unverified'
    },
    {
      key:'2',
      name:'Pan Card',
      link:emp.panURL,
      status: emp.panVerified ===true ? 'Verified' : 'Unverified'
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
    let month = tt.getUTCMonth()
    let yr = tt.getUTCFullYear()

    return date+"/"+month+"/"+yr
  }

  const getEmp = async()=>{
    let res = await props.getEmployee(params.id)
    if(res!=null && res!=undefined){
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
    }
  }

  useEffect(()=>{
    getEmp();
  },[])

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
               {/* <div className="employee-chat">
                    
                </div>
              */}
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
  