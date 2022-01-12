import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signup/SignUp";
import SignIn from "./pages/signin/SignIn";
import Landing from "./pages/landing/Landing";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

import { connect } from "react-redux";
import store from "./redux/store";
import { Alert } from "antd";

const App = (props)=>{
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
          </Route>
          <Route path="/signup" element={<SignUp/>} exact />
          <Route path="/signin" element={<SignIn/>} exact />
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
