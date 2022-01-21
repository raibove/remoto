import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import {Table, Tag, Button} from "antd";
import {Link} from "react-router-dom"
import { signup, getAllEmployee } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import store from "../../redux/store";
import "./Dashboard.css"
const {Column} = Table
const Dashboard = (props)=>{
    const [empData, setEmpData] = useState([]);

    useEffect(()=>{
        if(props.all_employee===null){
            props.getAllEmployee()
        }else{
            console.log(props.all_employee)
            setEmpData(props.all_employee.documents)
        }
    },[props.all_employee])
    return(
        <>
        <SideBar/>
        <div className="all-employee-container">
            <Link to="/new-employee">
            <Button type="primary" className="employee-add">
                Add Employee
            </Button>
            </Link>
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
        </div>
        <div>
        </div>
        </>
    )
}

const mapActionWithProps = {
    signup,
    getAllEmployee,
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(Dashboard);
  