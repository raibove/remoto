import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
/*
export default (Component) =>
  function PrivateRoute() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
      
    console.log("gg")
      (async () => {
        const tokenRes = localStorage.getItem("auth_token");
        try {
          if (tokenRes) {
            const res = await axios.get(`${baseURL}/users/verify_token`);
            const { status } = res;
            //console.log(res);
            if (status !== 200 && !tokenRes) {
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
    return <Component />;
  };

  */

  const PrivateRoute = ()=>{
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
      
        (async () => {
          const tokenRes = localStorage.getItem("auth_token");
          try {
            if (tokenRes) {
              const res = await axios.get(`${baseURL}/users/verify_token`);
              const { status } = res;
              //console.log(res);
              if (status !== 200 && !tokenRes) {
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
  export default PrivateRoute;
