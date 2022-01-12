import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
/*
export default (Component) =>
  function PublicRoute() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      (async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            navigate("/dashboard");
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
    return <Outlet />;
  };
  */

  const PublicRoute = ()=>{
    
    const navigate = useNavigate();
    //const [loading, setLoading] = useState(true);
/*
    useEffect(() => {
      (async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            navigate("/dashboard");
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
    */
    return <Outlet/>
  }
  export default PublicRoute