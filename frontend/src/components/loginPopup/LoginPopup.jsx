import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../storeContext/StoreContext';
import {assets} from '../../assets/assets.js';
import axios from 'axios';
import { toast } from'react-toastify';
import './LoginPopup.css';
const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, setUsername } = useContext(StoreContext);
  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevState) => ({ ...prevState, [name]: value || '' }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    const encodedUrl = `${url}/api/user/${currState.toLowerCase().replace(' ', '')}`;
    try {
      const response = await axios.post(encodedUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      if (response.data.success) {
        const { token, user } = response.data.data;
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('username', user.name);
        setShowLogin(false);
        toast.success(`Welcome, ${user.name}!`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(`Error logging in: ${error.message}. URL: ${encodedUrl}`);
      if (error.response && error.response.status === 404) {
        toast.error('The requested resource could not be found');
      } else {
        toast.error(
          'An error occurred while logging in. Please check the console logs for more information.'
        );
      }
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (currState === 'Login') {
      await onLogin(event);
    } else {
      try {
        const response = await axios.post(`${url}/api/user/register`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        if (response.data.success) {
          const { token, user } = response.data.data;
          setToken(token);
          localStorage.setItem('token', token);
          localStorage.setItem('username', user.name);
          setShowLogin(false);
          toast.success(`Account created successfully!`);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(`Error creating account: ${error.message}`);
        if (error.response && error.response.status === 404) {
          toast.error('The requested resource could not be found');
        } else {
          toast.error(
            'An error occurred while creating account. Please check the console logs for more information.'
          );
        }
      }
    }
  };

  return (
    <div className="Login-Popup">
      <form onSubmit={onSubmit} className="Login-cont">
        <div className="Login-Title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="Login-Inputs">
          {currState !== 'Login' && (
            <input onChange={onChangeHandler} value={data.name} name="name" type="text" placeholder='Your Name' required />
          )}
          <input onChange={onChangeHandler} value={data.email} name="email" type="email" placeholder='Your Email' required />
          <input onChange={onChangeHandler} value={data.password} name="password" type="password" placeholder='Password' required />
        </div>
        <button type="submit">
          {currState === 'Sign Up' ? 'Create Account' : 'Login'}                                                
        </button>
        <div className="Login-condition">
          {currState !== 'Login' && (
            <>
              <input type="checkbox" required />
              <p>By creating an account, I consent to the processing of my personal data in accordance with the Privacy Policy</p>
            </>
          )}
        </div>
        {currState === 'Login' ? (
          <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
        ) : null}
      </form>
     
    </div>
  );
};
export default LoginPopup;

