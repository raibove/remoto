import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import {Table, Tag, Button} from "antd";
import {Link} from "react-router-dom"
import { signup, getAllEmployee } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import xlsx from "xlsx"
import store from "../../redux/store";
import "./Dashboard.css"
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = (props)=>{
   
const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];
  
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return(
        <>
        <SideBar/>
        <div className="dashboard-container">
            <div className="dashboad-card-container">
                <div className="dashboard-card">
                    <p>25</p>
                    <p>Offers Send</p>
                </div>
                <div className="dashboard-card" style={{color:"#07FE5B"}}>
                    <p>15</p>
                    <p>Offers Accepted</p>
                </div>
                <div style={{color:"#CF2548"}}className="dashboard-card">
                    <p>10</p>
                    <p>Offers Rejected</p>
                </div>
            </div>
            <div className="dashboard-stats-container">
                <div>
                <PieChart width={400} height={400}>
        
                <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" />
                </PieChart >
          
                </div>
            </div>
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
  