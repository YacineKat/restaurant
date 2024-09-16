import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../storeContext/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import './Navbar.css';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    const { getTotalCartAmount, token, setToken, username, setUsername, profilePic, setProfilePic, url } = useContext(StoreContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();


    const handleImageError = (event) => {
        event.target.onerror = null;
        event.target.src = assets.profile_icon;
      };
    const Logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('profilePic'); 
        setToken('');
        setUsername('');
        setProfilePic(null); 
        navigate('/');
        setShowDropdown(false);
        window.location.reload();
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, [setUsername]);

    useEffect(() => {
        const fetchProfilePic = async () => {
          try {
            const response = await axios.get(`${url}/api/user/profile-pic`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (response.data.success) {
              setProfilePic(response.data.data.profilePicUrl);
            }
          } catch (error) {
            console.error('Error fetching profile picture:', error);
          }
        };
        fetchProfilePic();
      }, [token, setProfilePic, url]);

    return (
        <div className='Navbar' id='Navbar'>
            <Link to='/'>
                <img src={assets.logo} alt='' className='Logo' />
            </Link>
            <ul className='Navbar-Menu'>
                <Link to='/' onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>Home</Link>
                <a href='#Explore-Menu' onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>Menu</a>
                <a href='#App-Download' onClick={() => setMenu('mobile-app')} className={menu === 'mobile-app' ? 'active' : ''}>Mobile-App</a>
                <a href='#Footer' onClick={() => setMenu('contact-us')} className={menu === 'contact-us' ? 'active' : ''}>Contact Us</a>
            </ul>
            <div className='Navbar-Right'>
                <img src={assets.search_icon} alt='' />
                <div className='Navbar-Search-icon'>
                    <Link to='/cart'>
                        <img src={assets.basket_icon} alt='' />
                    </Link>
                    <div className={getTotalCartAmount() && 'Dot'}></div>
                </div>
                {!token
                    ? <button onClick={() => setShowLogin(true)}>Sign In</button>
                    : <div className="Nav-Profile" ref={dropdownRef}>
                        {profilePic ? <img src={profilePic} alt={username.data} onError={handleImageError}  onClick={toggleDropdown} />
                                    : <img
                                        src={assets.profile_icon} 
                                        alt="Profile"
                                        onClick={toggleDropdown}
                                        />}
                        {showDropdown && (
                            <ul className="Nav-Profile-Dropdown">
                                <Link to="/profile">
                                    <li>
                                        <img src={assets.settings} alt="" />
                                        <p className='Username'>{username}</p>
                                    </li>
                                </Link>
                                <hr />
                                <li>
                                    <img src={assets.bag_icon} alt="" />
                                    <p>Orders</p>
                                </li>
                                <hr />
                                <li>
                                    <img onClick={Logout} src={assets.logout_icon} alt="" />
                                    <p onClick={Logout}>Logout</p>
                                </li>
                            </ul>
                        )}
                    </div>
                }
            </div>
        </div>
    );
}

export default Navbar;

