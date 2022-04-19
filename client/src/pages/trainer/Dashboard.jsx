import React, {useEffect, useState} from "react"
import "./Dashboard.css"
import SideBar from "../../components/sidebar/SideBar"
import { Button, notification, Tooltip, Spin, Upload, Radio, message, Table, Tag, Col} from "antd";
import {FolderViewOutlined, CloseSquareOutlined, CheckSquareOutlined} from '@ant-design/icons'
import { signup, getAllEmployee, updateEmployee, changeTraining, getEmployeeInfo, getTrainedEmployee } from "../../redux/actions/userAction";
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
        if(props.trained_employee === null)
            props.getTrainedEmployee(query);
        else{
            console.log(props.trained_employee)
            if(props.trained_employee!=null && props.trained_employee.documents!=undefined){
                setData(props.trained_employee.documents)
                console.log(props.trained_employee.documents)
            }else if(props.trained_employee!=null){
                setData(null)
            }
        setLoading(false)

        }
    },[props.trained_employee])
    
    return(
        <div>
            <SideBar/>
            <div className="table-it">
            <Radio.Group defaultValue="all" size="medium" className="it-button" buttonStyle="solid" 
                    onChange={(e)=>{
                        setQuery(e.target.value)
                        dispatch({
                            type: "SET_TRAINED_EMPLOYEE",
                            payload: {trained_employee: null},
                          });
                }}>
                    <Radio.Button value="all">All</Radio.Button>
                    <Radio.Button value="pending">Pending</Radio.Button>
                    <Radio.Button value="trained">Trained</Radio.Button>
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
                        title="Training Status"
                        dataIndex="isTrained"
                        key="isTrained"
                        render={(isTrained)=>(
                            isTrained === true? 
                            <Tag color="purple">Trained</Tag>
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
                                d.isTrained===true?
                                    <></>
                                :
                                <Button type="primary" onClick={()=>{
                                    setLoading(true)
                                    console.log(_id)
                                    props.changeTraining(_id)
                                    setQuery("all")
                                    setLoading(false)
                                }}>Training Completed</Button>
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
    getTrainedEmployee,
    changeTraining
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    trained_employee: state.user.trained_employee

  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(Dashboard);
  