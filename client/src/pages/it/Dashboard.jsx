import React, {useEffect, useState} from "react"
import "./Dashboard.css"
import SideBar from "../../components/sidebar/SideBar"
import { Button, notification, Tooltip, Spin, Upload, Radio, message, Table, Tag, Col} from "antd";
import {FolderViewOutlined, CloseSquareOutlined, CheckSquareOutlined} from '@ant-design/icons'
import { signup, getAllEmployee, updateEmployee, changeAllocation, getEmployeeInfo, getItEmployee } from "../../redux/actions/userAction";
import { connect, useDispatch } from "react-redux";
import store from "../../redux/store";
const {Column} = Table

const Dashboard = (props)=>{
    const dispatch = useDispatch()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ query, setQuery] = useState("all")

    useEffect(()=>{
        setLoading(true)
        //console.log(loading)
        if(props.it_employee === null)
            props.getItEmployee(query);
        else{
            console.log(props.it_employee)
            if(props.it_employee!=null && props.it_employee.documents!=undefined){
                setData(props.it_employee.documents)
                console.log(props.it_employee.documents)
            }
        setLoading(false)

        }
    },[props.it_employee])
    
    return(
        <div>
            <SideBar/>
            <div className="table-it">
                <Radio.Group defaultValue="all" size="medium" className="it-button" buttonStyle="solid" 
                    onChange={(e)=>{
                        setQuery(e.target.value)
                        dispatch({
                            type: "SET_IT_EMPLOYEE",
                            payload: {it_employee: null},
                          });
                }}>
                    <Radio.Button value="all">All</Radio.Button>
                    <Radio.Button value="pending">Pending</Radio.Button>
                    <Radio.Button value="allocated">Allocated</Radio.Button>
                </Radio.Group>
                
                <Table
                    dataSource={data}
                    loading={loading}
                    style={{ whiteSpace: 'pre'}} 
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
                        title="Address"
                        dataIndex="address"
                        key="address"
                    />
                    <Column
                        title="Allocation"
                        dataIndex="isAllocated"
                        key="isAllocated"
                        render={(isAllocated)=>(
                            isAllocated === true? 
                            <Tag color="purple">Allocated</Tag>
                            :
                            <Tag color="red">Pending</Tag>
                        )
                        }
                    />
                    <Column
                        title="Action"
                        key="_id"
                        dataIndex="_id"
                        render={
                            (_id, d)=>(
                                d.isAllocated===true?
                                    <></>
                                :
                                <Button type="primary" onClick={()=>{
                                    setLoading(true)
                                    console.log(_id)
                                    props.changeAllocation(_id)
                                    setLoading(false)
                                }}>Allocate</Button>
                            )
                        }
                    />
                </Table>
                
            </div>
        </div>
    )
}

const mapActionWithProps = {
    signup,
    getAllEmployee,
    updateEmployee,
    getEmployeeInfo,
    getItEmployee,
    changeAllocation
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
    employee_info: state.user.employee_info,
    it_employee: state.user.it_employee
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(Dashboard);
  