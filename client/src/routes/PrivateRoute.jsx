import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import api from "../shared/api"
import { verifyToken } from "../redux/actions/userAction";
import { connect } from "react-redux";

  const PrivateRoute = (props)=>{
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
        (async () => {
          const tokenRes = localStorage.getItem("auth_token");
          try {
            if (tokenRes) {
              api()
              const res = await props.verifyToken();
              const { status } = res;
              console.log(status);
              console.log(tokenRes);
              if (status !== 200) {
                navigate("/signin");
              }
            } else {
              navigate("/signin");
            }
            
            setLoading(false);
          } catch (e) {
            console.log(e);
            setLoading(false);
          }
        })();
      }, []);
      if (loading) {
        return null;
      }
    return <Outlet/>

  }
  
const mapActionWithProps = {
  verifyToken,
};

const mapPropsWithState = (state) => ({
  alert_message: state.user.alert_message,
  success_message: state.user.success_message,
});

export default connect(mapPropsWithState, mapActionWithProps)(PrivateRoute);
