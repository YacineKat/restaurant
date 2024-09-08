import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../storeContext/StoreContext'

const Navbar = ({setShowLogin}) =>{
    const [menu,setMenu] = useState('home');
    const {getTotalCartAmount} = useContext(StoreContext)
  return (
    <div className='Navbar'>
      <Link to='/'>
        <img src={assets.logo} alt='' className='Logo'/>
      </Link>
      <ul className='Navbar-Menu'>
        <Link to='/' onClick={()=>setMenu('home')} className={menu === 'home'?'active':''} >Home</Link>
        <a href='#Explore-Menu' onClick={()=>setMenu('menu')} className={menu === 'menu'?'active':''}>Menu</a>
        <a href='#App-Download' onClick={()=>setMenu('mobile-app')} className={menu === 'mobile-app'?'active':''} >Mobile-App</a>
        <a href='#Footer' onClick={()=>setMenu('contact-us')} className={menu === 'contact-us'?'active':''} >Contact Us</a>
      </ul>
      <div className='Navbar-Right'>
        <img src={assets.search_icon} alt='' />
        <div className='Navbar-Search-icon'>
          <Link to='/cart'>
            <img src={assets.basket_icon} alt='' />
          </Link>
            <div className={getTotalCartAmount()&&'Dot'}></div>
        </div>
        <button onClick={()=>setShowLogin(true)} >Sign In</button>
      </div>
    </div>
  )
}

export default Navbar
