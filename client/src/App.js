import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signup/SignUp";
import SignIn from "./pages/signin/SignIn";
import Landing from "./pages/landing/Landing";
import E404 from "./pages/error/E404";
import Dashboard from "./pages/dashboard/Dashboard"
import NewEmployee from "./pages/employee/NewEmployee"
import Employee from "./pages/employee/Employee"
import Account from "./pages/account/Account"
import Letter from "./pages/letter/Letter"
import SingleEmployee from "./pages/employee/SingleEmployee"
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

import api from "./shared/api"; 
import { connect } from "react-redux";
import store from "./redux/store";
import { Alert } from "antd";

const App = (props)=>{

  useEffect(() => {
    api();
    /*(async () => {
      try {
        const role = localStorage.getItem("role");
        setRole(role);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
    */
  }, []);

  return(
    <div>
       {props.success_message !== null ? (
          <Alert
            type="success"
            message="Success"
            description={props.success_message}
            showIcon
            closable
            style={{
              position: "absolute",
              zIndex: 100,
              top: 30,
              right: 30,
              width: "300px",
            }}
            onClose={() =>
              store.dispatch({ type: "SUCCESS_DATA", payload: "" })
            }
          />
        ) : (
          ""
        )}
      <Router>
        <Routes>
        {/*  <Route path="/" element={PublicRoute(Landing)} exact />
        */}
          <Route element={<PublicRoute/>}>
            <Route path="/" element={<Landing/>} exact />  
            <Route path="/signup" element={<SignUp/>} exact />
            <Route path="/signin" element={<SignIn/>} exact />
            <Route path="/letter/:id" element={<Letter/>} exact />
          </Route>
          <Route element={<PrivateRoute/>}>
            <Route path="/dashboard" element={<Dashboard/>} exact />  
            <Route path="/employee" element={<Employee/>} exact />  
            <Route path="/account" element={<Account/>} exact />  
            <Route path="/employee/:id" element={<SingleEmployee/>} exact />  
            <Route path="/new-employee" element={<NewEmployee/>} exact/>
          </Route>
          <Route path="*" element={<E404/>} />

        </Routes>
      </Router>
    </div>
  )
}


const mapPropsWithState = (state) => ({
  success_message: state.user.success_message,
  error_message: state.user.error_message,
});

export default connect(mapPropsWithState)(App);
