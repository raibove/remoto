import React, {useEffect} from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Dropdown } from 'antd';
import { MenuOutlined, DownOutlined  } from "@ant-design/icons";
import Logo from "../../assets/img/logoBlue.png";
import "./navbar.css"

const Navbar = ()=>{
    const toggleMenu = async () => {
        const right = document.getElementsByClassName("right")[0];
        const NavContainer = document.getElementsByClassName("NavContainer")[0];
        right.classList.toggle("active");
        NavContainer.classList.toggle("active");
      };
      
    return(
        <div className="Navbar">
            
                <div className="NavContainer">
                    <div className="left">
                    <img src={Logo} alt="remoto" className="remoto-logo" />
                    <div className="NavMenu">
                    <MenuOutlined
                        className="menuBar"
                        id="toggle-button"
                        onClick={() => toggleMenu()}
                    />
                </div>
                    </div>
                    <div className="right">
                    <ul className="nav">
                        <li className="nav-item">
                        <NavLink
                            activeClassName="active-nav-link"
                            className="nav-link"
                            to="/"
                            onClick={() => {
                            window.location.replace("/#");
                            }}
                        >
                            Home
                        </NavLink>
                        </li>
                        <li className="nav-item">
                        <NavLink
                            activeClassName="active-nav-link"
                            className="nav-link"
                            to="/"
                            onClick={() => {
                            window.location.replace("/#");
                            }}
                        >
                            About
                        </NavLink>
                        </li>
                        <li className="nav-item">
                        <NavLink
                            activeClassName="active-nav-link"
                            className="nav-link"
                            to="/signup"
                            onClick={() => {
                            window.location.replace("/#");
                            }}
                        >
                            SignIn
                        </NavLink>
                        </li>
                    </ul>
                    </div>
                </div>
                
        </div>
    )
}

export default Navbar;