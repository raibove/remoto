import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import {Table, Tag, Upload, Tabs, message, notification,Button} from "antd";
import {Link} from "react-router-dom"
import { signup, getAllEmployee,addMultipleEmployee } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import xlsx from "xlsx"
import store from "../../redux/store";
import { UploadOutlined } from '@ant-design/icons';
import "./Employee.css"
const {Column} = Table

const { TabPane } = Tabs;
const Employee = (props)=>{
    const [empData, setEmpData] = useState([]);

    useEffect(()=>{
        if(props.all_employee===null){
            props.getAllEmployee()
        }else{
            console.log(props.all_employee)
            setEmpData(props.all_employee.documents)
        }
    },[props.all_employee])

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
  
    
    const readUploadFile =  (e) => {
        e.preventDefault();
        console.log("called")
       
        console.log(e.target.files)
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                console.log(json);
                //return json;
                try{
                let eres = await props.addMultipleEmployee(json)
                }catch(err){
                    console.log(err)
                }
            };
            reader.readAsArrayBuffer(e.target.files[0]);
            e.target.value = ''
        }
        
        return null;
    }


    return(
        <>
        <SideBar/>
        <div className="all-employee-container">
            <div style={{height:"50px"}}>
            <Link to="/new-employee">
            <Button type="primary" className="employee-add">
                Add Employee
            </Button>
            </Link>
            <div>
            <label onChange={readUploadFile} htmlFor="formId">
                <input
                        type="file"
                        accept=".xlsx, .xls, .csv" 
                        id="formId" 
                        name=""
                        hidden 
                    />
                    <p  className="employee-upload"><UploadOutlined/> Upload file</p>
            </label>
            </div>
            </div>
            <Tabs defaultActiveKey="1" style={{width:"100%"}}>
                <TabPane tab="Employee" key="1">
                <Table
                    dataSource={empData}
                    className="employee-table"
                >
                    <Column
                        title="Name"
                        dataIndex="name"
                        key="name"
                    />
                    <Column
                        title="Email"
                        dataIndex="email"
                        key="email"
                    />
                    <Column
                        title="Role"
                        dataIndex="career"
                        key="career"
                    />
                    <Column
                        title="Status"
                        dataIndex="status"
                        key="status"
                    />
                </Table>
                </TabPane>
                <TabPane tab="Pending" key="2">
                Content of Tab Pane 2
                </TabPane>
            </Tabs>
        </div>
        <div>
        </div>
        </>
    )
}

const mapActionWithProps = {
    signup,
    getAllEmployee,
    addMultipleEmployee
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(Employee);
  