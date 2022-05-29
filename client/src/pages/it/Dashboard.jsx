import React, {useEffect, useState} from "react"
import "./Dashboard.css"
import SideBar from "../../components/sidebar/SideBar"
import { Button, notification, Modal, Tooltip, Spin, Upload, Input, Radio, message, Table, Tag, Col} from "antd";
import {FolderViewOutlined, CloseSquareOutlined, CheckSquareOutlined, MessageOutlined} from '@ant-design/icons'
import { signup, getAllEmployee, updateEmployee, changeAllocation, getEmployeeInfo, getItEmployee, addEmployeeMessage } from "../../redux/actions/userAction";
import { connect, useDispatch } from "react-redux";
import store from "../../redux/store";
const {Column} = Table
const {TextArea} = Input;
const Dashboard = (props)=>{
    const dispatch = useDispatch()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ query, setQuery] = useState("all")
    const [modalVisible, setModalVisible] = useState(false);
    const [employeeMessage, setEmployeeMessage] = useState("")
    const [key, setKey] = useState(0)
    const [ID, setID] = useState(null)

    const handleSave = async ()=>{
        setLoading(true)
        let rr = await props.addEmployeeMessage(ID, employeeMessage);
        if(rr.data!=undefined && rr.data!=null){
            console.log(rr.data)
            props.getItEmployee(query);
          //  setData(rr.data.documents)
        }
        setModalVisible(false)
        setLoading(false)
    }

    const handleCancel = ()=>{
        if(data.employeeMessage != undefined && data.employeeMessage !=null){
            setEmployeeMessage(data[key].employeeMessage);
        }else{
            setEmployeeMessage("");
        }
        setModalVisible(false)
    }
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
            }else if(props.it_employee!=null){
                setData(null)
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
                            (_id, d, ind)=>(
                                <>{
                                    d.isAllocated===true?
                                        <></>
                                    :
                                    <Button type="primary" onClick={()=>{
                                        setLoading(true)
                                        console.log(_id)
                                        props.changeAllocation(_id)
                                        setLoading(false)
                                    }}>Allocate</Button>
                                    
                                }
                                <>
                                <MessageOutlined className="message-icon" onClick={()=>{setModalVisible(true); setKey(ind); setID(_id); setEmployeeMessage(d.employeeMessage!=undefined? d.employeeMessage:"")
                                }}/>
                                </></>
                            )
                        }
                    />
                </Table>
                <Modal
                    visible={modalVisible}
                    onOk={handleSave}
                    onCancel={handleCancel}
                >
                    <TextArea rows={4} value={employeeMessage} onChange={(e)=>{setEmployeeMessage(e.target.value)}}/>
                </Modal>
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
    changeAllocation,
    addEmployeeMessage
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
    employee_info: state.user.employee_info,
    it_employee: state.user.it_employee
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(Dashboard);
  