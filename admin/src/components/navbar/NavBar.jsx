import React from 'react'
import './NavBar.css'
import { assets } from '../../assets/assets';

const NavBar = () => {
  return (
    <div className='NavBar'>
        <img className='Logo' src={assets.logo} alt="" />
        <img className='Profile' src={assets.profile_image} alt="" />
    </div>
  )
}

export default NavBar
