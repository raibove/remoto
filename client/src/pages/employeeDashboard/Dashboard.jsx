import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import { Button, notification, Upload, message} from "antd";
import {FolderViewOutlined} from '@ant-design/icons'
import {useParams} from "react-router-dom"
import { signup, getAllEmployee, updateEmployee } from "../../redux/actions/userAction";
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
  const [type, setType] = useState(null);
  const [fileUploading, setFileUploading] = useState(false)
  const [saveDisabled, setSaveDisabled] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  const params = useParams();
  const close = () => {
    store.dispatch({ type: "SET_ALERT", payload: { message: null } });
  };

  
const openNotification = (err) => {
  notification["error"]({
    message: "Error in Saving",
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
   
   if(type=="pan"){
      setPanURL(res.data.imagePath)
    }else if(type=="adhar"){
      setAdharURL(res.data.imagePath)
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
      adharURL: adharURL
    }
    await props.updateEmployee(data)
    await setSaveLoading(false)
}


/***/

return(
    <>
    <SideBar/>
    <div className="empdash">
      <div className="empcontainer">
        <div className="doc">
          <p>Adhars Card: </p>
          <Button><FolderViewOutlined /></Button>
          <Upload {...fileProps}>
            <Button loading={fileUploading} onClick={()=>{setType("adhar")}}>
              Upload Adhar
            </Button>
          </Upload>
        </div>
        <div className="doc">
          <p>Pan Card: </p>
          <Button><FolderViewOutlined /></Button>
          <Upload {...fileProps}>
            <Button  loading={fileUploading} onClick={()=>{setType("pan")}}>
              Upload Pan Card
            </Button>
          </Upload>
        </div>
        <div>
          <Button type="primary"loading={saveLoading} onClick={saveEmployee} disabled={saveDisabled} loading={saveLoading}>Save</Button>
        </div>
      </div>
    </div>
    </>
  )
}

const mapActionWithProps = {
    signup,
    getAllEmployee,
    updateEmployee
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
    all_employee: state.user.all_employee,
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(UserDashboard);
  