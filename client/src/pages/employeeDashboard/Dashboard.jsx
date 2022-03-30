import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import { Button, notification, Tooltip, Spin, Upload, message} from "antd";
import {FolderViewOutlined, CloseSquareOutlined, CheckSquareOutlined} from '@ant-design/icons'
import {useParams} from "react-router-dom"
import { signup, getAllEmployee, updateEmployee, getEmployeeInfo } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import store from "../../redux/store";
import "./Dashboard.css"
import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL;
const UserDashboard = (props)=>{
  const [loading, setLoading] = useState(true)
  const [fileList, setFileList] = useState([])
  const [adharURL, setAdharURL] = useState("")
  const [panURL, setPanURL] = useState("")
  const [panNo, setPanNo] = useState("")
  const [adharNo, setAdharNo] = useState("")
  const [type, setType] = useState(null);
  const [fileUploading, setFileUploading] = useState(false)
  const [saveDisabled, setSaveDisabled] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [adharVerified, setAdharVerified] = useState(false)
  const [panVerified, setPanVerified] = useState(false)

  const params = useParams();
  const close = () => {
    store.dispatch({ type: "SET_ALERT", payload: { message: null } });
  };

  
const openNotification = (err) => {
  notification["error"]({
    message: "Error",
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

useEffect(()=>{
  setLoading(true)
  if(props.employee_info==null){
    props.getEmployeeInfo(params.id)
  }else{
    console.log(props.employee_info)
    if(props.employee_info.data!=undefined){
      
      if(props.employee_info.data.panURL!=undefined){
        setPanURL(props.employee_info.data.panURL)
      }
      if(props.employee_info.data.panNo!=undefined){
        setPanNo(props.employee_info.panNo)
      }
      if(props.employee_info.data.adharURL!=undefined){
        setAdharURL(props.employee_info.data.adharURL)
      }
      if(props.employee_info.data.adharNo!= undefined){
        setAdharNo(props.employee_info.data.adharNo)
      }
      if(props.employee_info.data.adharVerified!=undefined){
        setAdharVerified(props.employee_info.data.adharVerified)
      }
      if(props.employee_info.data.panVerified!=undefined){
        setPanVerified(props.employee_info.data.panVerified)
      }
    }
  }
  setLoading(false)
}, [props.employee_info])
/**
* File upload
*/

 const fileProps = {
  onRemove: (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  },

  beforeUpload: (file) => {
    setFileUploading(true)
    setSaveDisabled(true)
    handleUpload(file);
    return false;
  },
  fileList,
};


const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("description", type);
  
  try {
    const res = await axios.post(
      `${baseURL}/users/images`,
      formData
    );
   console.log(res.data)
   
   if(type=="pan" && res.data.length>=4){
      setPanURL(res.data[3])
      setPanNo(res.data[1])
    }else if(type=="adhar" && res.data.length>=5){
      setAdharURL(res.data[4])
      setAdharNo(res.data[1])
    }
    setFileUploading(false)
    setSaveDisabled(false)
    console.log(panURL)
    console.log(adharURL)
    message.success("upload successfully.");
  } catch (e) {
    message.error("upload failed.");
    setFileUploading(false)
    setSaveDisabled(false)
  }
};

const saveEmployee = async ()=>{
  setSaveLoading(true)
    let data = {
      id: params.id,
      panURL: panURL,
      adharURL: adharURL,
      panNo: panNo,
      adharNo: adharNo
    }
    await props.updateEmployee(data)
    await setSaveLoading(false)
}


/***/

return(
    <>
    <SideBar/>
    {
    loading===true?
      <Spin/>
      :
      <div className="empdash">
        <div className="empcontainer">
          <div className="doc">
            <p>Aadhar Card: </p>
            {adharURL===""?
            <Tooltip title="No Doc Uploaded">
              <FolderViewOutlined className="viewDoc" disabled/>
            </Tooltip>
            :
            <a href={adharURL} target="_blank">
              <FolderViewOutlined className="viewDoc"/>
            </a>
            } 
            <Upload {...fileProps}>
              <Button loading={fileUploading} onClick={()=>{setType("adhar")}}>
                Upload Aadhar
              </Button>
            </Upload>
            {adharVerified==false?
              <Tooltip title=" Document Unverified">
               <CloseSquareOutlined className="doc-unverified"/>
              </Tooltip>
              :
              <Tooltip title=" Document Verified">
                <CheckSquareOutlined className="doc-verified"/>
              </Tooltip>
            }
          </div>
          <div className="doc">
            <p>Pan Card: </p>
            {panURL===""?
              <Tooltip title="No Doc Uploaded">
                <FolderViewOutlined className="viewDoc" disabled/>
              </Tooltip>
              :
              <a href={panURL} target="_blank">
                <FolderViewOutlined className="viewDoc"/>
              </a>
            }
            <Upload {...fileProps}>
              <Button  loading={fileUploading} onClick={()=>{setType("pan")}}>
                Upload Pan Card
              </Button>
            </Upload>
            {
              panVerified===false?
              <Tooltip title=" Document Unverified">
                <CloseSquareOutlined className="doc-unverified"/>
              </Tooltip>
              :
              <Tooltip title=" Document Verified">
               <CheckSquareOutlined className="doc-verified"/>
              </Tooltip>
            }
          </div>
          <div>
            <Button type="primary" onClick={saveEmployee} disabled={saveDisabled} loading={saveLoading}>Save</Button>
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
    updateEmployee,
    getEmployeeInfo
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
    employee_info: state.user.employee_info
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(UserDashboard);
  