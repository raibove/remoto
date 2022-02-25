import React, {useEffect, useState} from "react"
import SideBar from "../../components/sidebar/SideBar"
import {Table, Tag, Button, notification, Upload, message} from "antd";
import {Link} from "react-router-dom"
import { signup, getAllEmployee } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import xlsx from "xlsx"
import store from "../../redux/store";
import "./Dashboard.css"
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL;
const UserDashboard = (props)=>{
  const [fileList, setFileList] = useState([])

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
    handleUpload(file);
    return false;
  },
  fileList,
};


const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const res = await axios.post(
      `${baseURL}/users/images`,
      formData
    );
    let temp = [
      {
        url: res.data.attachments[0].filePath,
        name: file.name,
      },
    ];
    setFileList(temp);
   // setPreviewImage(res.data.attachments[0].filePath);
    let og = props.org;
    og.logo_url = res.data.attachments[0].filePath;
    props.setOrg(og);
    message.success("upload successfully.");
  } catch (e) {
    message.error("upload failed.");
  }
};


/** */
  return(
        <>
        <SideBar/>
        <div>
          <Upload {...fileProps}>
            <Button>
              Upload Adhar
            </Button>
          </Upload>
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
  
  export default connect(mapPropsWithState, mapActionWithProps)(UserDashboard);
  