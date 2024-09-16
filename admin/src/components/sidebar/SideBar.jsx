import React from 'react'
import './SideBar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
const SideBar = () => {
  return (
    <div className="SideBar">
        <div className="SideBar-Options">
          <NavLink to='/add' className="SideBar-Option">
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
          </NavLink>
          <NavLink to='/list' className="SideBar-Option">
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
          </NavLink>
          <NavLink to='/orders' className="SideBar-Option">
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
          </NavLink>
        </div>
    </div>
  )
}

export default SideBar
