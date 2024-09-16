import React from 'react'
import './Footer.css'
import {assets} from '../../assets/assets'
const Footer = () => {
  return (
    <div className="Footer" id="Footer" >
      <div className="Footer-Content">
        <div className="Footer-Left">
            <img src={assets.logo} alt="" />
            <p>lorem ipsum dolor sit abet consectetur adipisicing elit.is simply dummy text of the printing and typesetting industry the printing and typesetting industry. </p>
            <div className="Footer-Social-Icon">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />   
            </div>
            
        </div>
        <div className="Footer-Center">
            <h2>COMPANY</h2>
            <ul>
                <li><a href="#Navbar">Home</a></li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="Footer-Right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+123 657572115</li>
                <li>yacinekatrouci@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="Footer-Copyright">Copyright 2024 ️© KAY.com - All rights Reserved.</p>
    </div>
  )
}

export default Footer
