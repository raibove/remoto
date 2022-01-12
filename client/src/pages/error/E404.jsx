import React, { useState } from "react";
import "./E404.css";
import { useNavigate } from "react-router-dom";
import {Spin} from "antd"

const E404 = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const GoHome = () => {
    setLoading(true);
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {loading === true ? (
        <Spin size="large" />
      ) : (
        <div className="box">
          <h3 className="not-found">Page not found</h3>
          <h1 className="err">404</h1>
          <p className="err-404">
            Oops!! The page you were looking for do not exist.
          </p>
          <button onClick={GoHome} className="homeBtn">
            Home Page
          </button>
        </div>
      )}
    </>
  );
};

export default E404;
