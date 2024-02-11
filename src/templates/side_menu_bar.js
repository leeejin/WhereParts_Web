import React, { Component, Nav } from "react";
import { Link, NavLink, } from "react-router-dom";


import Constant from "../util/constant_variables";

export default class SideMenuBar extends Component {
    constructor(props) {
        super(props);
      
        this.state = {
            selectList:Constant.getSideMenus(),
        }
    }

    render() {
        return (

            <div className="menu-bar LightBlue">
                {
                    this.state.selectList.map((m, i) =>
                        <div className='sidemenu' key={i}>
                            <NavLink to={m.href} className={({ isActive }) => isActive ? "sidemenu-active" : "sidemenu-inactive"}>
                                {m.icon} {m.name}
                            </NavLink>
                        </div>
                    )
                }
            </div>
        )
    }
}