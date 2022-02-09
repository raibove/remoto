import React, {useEffect, useState} from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/img/logo.png";
import SignUpImage from "../../assets/img/signupImage.svg";
import {Button, Input, notification} from 'antd';
import { GoogleOutlined } from '@ant-design/icons';

import { signup, signupphone } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import store from "../../redux/store";

import "./SignUp.css"

const SignUp = (props)=>{

    const [name,setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    
  const signUpMail = async () => {
    setLoading(true);
    try {
      const data = {
        name: name,
        role: "admin",
        email: email,
        password: password,
        //phone: "4454"
      };
      let chck = await props.signup(data);
      console.log(chck)
      /*if(chck !=undefined && chck)
        window.location.href="/signup/verifymail"
        */
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const close = () => {
    store.dispatch({ type: "SET_ALERT", payload: { message: null } });
  };

  const openNotification = (data) => {
    notification["error"]({
      message: "Error in signup",
      description: data.message,
      onClose: close,
    });
  };

  useEffect(() => {
    if (props.alert_message !== null && props.alert_message!= undefined) {
      openNotification(props.alert_message.data);
     console.log(props.alert_message.data)
    }
  }, [props.alert_message]);

  return(
      <div className="signup">
          <div className="signup-left">
              <div>
                  <Link to="/">
                  <img alt="logo" src={Logo} className="signupLogo"/>
                  </Link>
              </div>
              <p className="signup-para">
                  Onboard new hire easily !!! <br/>
                  No hustle, No worries...
              </p>
              <img alt="signup" src={SignUpImage} className="SignUpImage"/>
            
          </div>
          <div className="signup-right">
              <h3>Create Account</h3>
              {/*
              <Button style={{fontWeight:"600"}} icon={<GoogleOutlined style={{color:"green"}}/>}>Google</Button>
              <br/>
              <p>--OR--</p>
              */}
              <Input placeholder="Full Name" bordered={false} 
                  onChange={(e)=>{
                      setName(e.target.value)                        
                  }} 
                value={name} 
                className="signupInput"
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    signUpMail();
                  }
                }}
              />
              <Input placeholder="Email" bordered={false} className="signupInput"
                onChange={(e)=>{
                  setEmail(e.target.value)                        
                  }} 
                value={email} 
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    signUpMail();
                  }
                }}
              />
              <Input.Password placeholder="Password" bordered={false} className="signupInput"
                onChange={(e)=>{
                  setPassword(e.target.value)                        
                  }} 
                value={password} 
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    signUpMail();
                  }
                }}
              />
              <Button className="signupButton" type="primary" loading={loading} onClick={signUpMail}>Create an Account</Button>
              <Link to="/signin">
                  <p>Already a user? Click here to login.</p>
              </Link>
          </div>
      </div>
  )
}

const mapActionWithProps = {
    signup,
  };
  
  const mapPropsWithState = (state) => ({
    alert_message: state.user.alert_message,
    success_message: state.user.success_message,
  });
  
  export default connect(mapPropsWithState, mapActionWithProps)(SignUp);
  