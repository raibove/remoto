import React, { useState, useEffect } from "react";
import "./SideBar.css";
import { NavLink } from "react-router-dom";
import {
  PieChartTwoTone,
  FileTextTwoTone,
  ToolTwoTone,
  LogoutOutlined,
  RightCircleTwoTone,
  UserSwitchOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

import { signout } from "../../redux/actions/userAction";
import { connect } from "react-redux";



const Siderbar = ({ signout }) => {
    const [role, setRole] = useState("admin");
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(true);
    let width = window.innerWidth;

    
  useEffect(() => {
    (async () => {
      try {
        const role = localStorage.getItem("role");
        const id = localStorage.getItem("id");
        setRole(role);
        setId(id);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  }, []);
  if (loading) {
    return null;
  }

  
  return (
    <>
      {role === "admin" ? (
        <>
           {width > 650 ? (
            <>
              <nav className="sidebar">
                <ul className="sidebar-nav">
                  <li className="logo">
                    <div className="logo-side-link">
                      <span className="logo-link-text logo-text">Remoto</span>
                      <RightCircleTwoTone
                        twoToneColor="#dd5dfd"
                        style={{ fontSize: "1.75rem" }}
                      />
                    </div>
                  </li>
                  {/* DASHBOARD */}
                  <li className="side-item">
                    <NavLink
                      to="/dashboard"
                      activeClassName="active-side-nav-link"
                      className="side-link"
                    >
                      <PieChartTwoTone
                        twoToneColor="#dd5dfd"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span className="link-text">Dashboard</span>
                    </NavLink>
                  </li>
                  {/* Employee */}
                  <li className="side-item">
                    <NavLink
                      to="/employee"
                      activeClassName="active-side-nav-link"
                      className="side-link"
                    >
                      <PieChartTwoTone
                        twoToneColor="#dd5dfd"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span className="link-text">Employee</span>
                    </NavLink>
                  </li>
                   {/* Account */}
                   <li className="side-item">
                    <NavLink
                      to="/account"
                      activeClassName="active-side-nav-link"
                      className="side-link"
                    >
                      <PieChartTwoTone
                        twoToneColor="#dd5dfd"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span className="link-text">Account</span>
                    </NavLink>
                    </li>
                  
                  {/* LOGOUT */}
                  <li
                    className="side-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => signout()}
                  >
                    <span className="side-link">
                      <LogoutOutlined style={{ fontSize: "1.5rem" }} />
                      <span className="link-text">SignOut</span>
                    </span>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            <nav className="sidebar">
              <ul className="sidebar-nav">
                <li className="logo">
                  <div className="logo-side-link">
                    <span className="logo-link-text logo-text">Remoto</span>
                    <RightCircleTwoTone
                      twoToneColor="#dd5dfd"
                      style={{ fontSize: "1.75rem" }}
                    />
                  </div>
                </li>
                {/* DASHBOARD */}
                <li className="side-item">
                  <NavLink
                    to="/dashboard"
                    activeClassName="active-side-nav-link"
                    className="side-link"
                  >
                    <PieChartTwoTone
                      twoToneColor="#dd5dfd"
                      style={{ fontSize: "1.5rem" }}
                    />
                    <span className="link-text">Dashboard</span>
                  </NavLink>
                </li>
                 {/* Employee */}
                 <li className="side-item">
                    <NavLink
                      to="/employee"
                      activeClassName="active-side-nav-link"
                      className="side-link"
                    >
                      <PieChartTwoTone
                        twoToneColor="#dd5dfd"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span className="link-text">Employee</span>
                    </NavLink>
                  </li>
                   {/* Account */}
                   <li className="side-item">
                    <NavLink
                      to="/account"
                      activeClassName="active-side-nav-link"
                      className="side-link"
                    >
                      <PieChartTwoTone
                        twoToneColor="#dd5dfd"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span className="link-text">Account</span>
                    </NavLink>
                    </li>
                  
                {/* LOGOUT */}
                <li
                  className="side-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => signout()}
                >
                  <span className="side-link">
                    <LogoutOutlined style={{ fontSize: "1.5rem" }} />
                    <span className="link-text">SignOut</span>
                  </span>
                </li>
              </ul>
            </nav>
          )}
        </>
    ) : (
      <>
      {width > 650 ? (
       <>
         <nav className="sidebar">
           <ul className="sidebar-nav">
             <li className="logo">
               <div className="logo-side-link">
                 <span className="logo-link-text logo-text">Remoto</span>
                 <RightCircleTwoTone
                   twoToneColor="#dd5dfd"
                   style={{ fontSize: "1.75rem" }}
                 />
               </div>
             </li>
             {/* DASHBOARD */}
             <li className="side-item">
               <NavLink
                 to={"/dashboard/"+id}
                 activeClassName="active-side-nav-link"
                 className="side-link"
               >
                 <PieChartTwoTone
                   twoToneColor="#dd5dfd"
                   style={{ fontSize: "1.5rem" }}
                 />
                 <span className="link-text">Dashboard</span>
               </NavLink>
             </li>
            
             {/* LOGOUT */}
             <li
               className="side-item"
               style={{ cursor: "pointer" }}
               onClick={() => signout()}
             >
               <span className="side-link">
                 <LogoutOutlined style={{ fontSize: "1.5rem" }} />
                 <span className="link-text">SignOut</span>
               </span>
             </li>
           </ul>
         </nav>
       </>
     ) : (
       <nav className="sidebar">
         <ul className="sidebar-nav">
           <li className="logo">
             <div className="logo-side-link">
               <span className="logo-link-text logo-text">Remoto</span>
               <RightCircleTwoTone
                 twoToneColor="#dd5dfd"
                 style={{ fontSize: "1.75rem" }}
               />
             </div>
           </li>
           {/* DASHBOARD */}
           <li className="side-item">
             <NavLink
               to={"/dashboard/"+id}
               activeClassName="active-side-nav-link"
               className="side-link"
             >
               <PieChartTwoTone
                 twoToneColor="#dd5dfd"
                 style={{ fontSize: "1.5rem" }}
               />
               <span className="link-text">Dashboard</span>
             </NavLink>
           </li>
          
           {/* LOGOUT */}
           <li
             className="side-item"
             style={{ cursor: "pointer" }}
             onClick={() => signout()}
           >
             <span className="side-link">
               <LogoutOutlined style={{ fontSize: "1.5rem" }} />
               <span className="link-text">SignOut</span>
             </span>
           </li>
         </ul>
       </nav>
     )}
    </>
        )}
    </>
    );
}

const mapActionWithProps = {
    signout,
  };
  
  export default connect(null, mapActionWithProps)(Siderbar);
  