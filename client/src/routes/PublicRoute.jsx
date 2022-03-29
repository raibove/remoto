import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {Spin} from 'antd';

const PublicRoute = ()=> {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
     
        try {
          const token = localStorage.getItem("auth_token");
          const id = localStorage.getItem("id");
          const role = localStorage.getItem("role")
          if (token) {
            if(role=="employee"){
              navigate(`/dashboard/${id}`)
            } else{
              navigate("/dashboard");
            }
          }
          setLoading(false);
        } catch (e) {
          console.log(e);
          setLoading(false);
        }
    }, []);
    if (loading) {
      return <Spin/>;
    }
    return <Outlet />;
  };

/*
  const PublicRoute = ()=>{
    
    const navigate = useNavigate();
 
    return <Outlet/>
  }
 */
 export default PublicRoute