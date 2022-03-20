import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import {Table, Tag, Button, notification} from "antd";
import {Link} from "react-router-dom"
import { signup, getAllEmployee } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import xlsx from "xlsx"
import store from "../../redux/store";
import "./Dashboard.css"
import { PieChart, Pie, Cell, Tooltip } from 'recharts';


  
const data = [
  { name: "SE1", value: 400 },
  { name: "SE2", value: 300 },
  { name: "Manager", value: 300 },
  { name: "Sales", value: 200 },
  { name: "Product Management", value: 278 },
  { name: "Marketing", value: 189 },
];
//const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const Tip = ({ setShowTooltip, ...rest }) => {
  const [payload, setPayload] = React.useState(rest.payload);

  // When the payload has data (area hovered in the chart), add it to the state
  // so we can use it to show and hide the tooltip at our expense
  React.useEffect(() => {
    rest.payload.length && setPayload(rest.payload);
  }, [rest.payload]);

  return payload.length ? (
    <div
      // Tooltip hides when leaving the tooltip itself
      onMouseLeave={() => setShowTooltip(false)}
      // Prevent Rechart events while the mouse is over the tooltip
      onMouseMove={e => e.stopPropagation()}
      style={{
        background: "white",
        padding: "5px",
        borderRadius: "4px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }}
    >
      {`${payload[0].name}: ${payload[0].value}`}
    </div>
  ) : null;
};


const Dashboard = (props)=>{
  const [showTooltip, setShowTooltip] = useState(false);

const close = () => {
    store.dispatch({ type: "SET_ALERT", payload: { message: null } });
  };

  
const openNotification = (err) => {
  notification["error"]({
    message: "Error in dashboard",
    description: err.message,
    onClose: close,
  });
};

useEffect(() => {
  if (props.alert_message !== null && props.alert_message!= undefined) {
   openNotification(props.alert_message.data);
   console.log(props.alert_message)
  }
}, [props.alert_message]);


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
                <PieChart width={400} height={400} onMouseLeave={() => setShowTooltip(false)}>
                  <Pie 
                    data={data} 
                    dataKey="value" 
                    onMouseEnter={() => setShowTooltip(true)}
                    isAnimationActive={false}
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    fill="#8884d8" 
                    labelLine={false}
                    label={renderCustomizedLabel}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`}  />//fill={COLORS[index % COLORS.length]}
                      ))}
                    </Pie>
                    {showTooltip && (
                      <Tooltip
                        // Anymation is a bit weird when the tooltip shows up after hidding
                        isAnimationActive={false}
                        // Send props down to get the payload
                        content={<Tip setShowTooltip={setShowTooltip} />}
                        // We need this to manage visibility ourselves
                        wrapperStyle={{ visibility: "visible", pointerEvents: "auto" }}
                      />
                    )}
                 </PieChart>
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
  