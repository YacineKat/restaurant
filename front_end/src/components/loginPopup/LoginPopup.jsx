import React, { useState, useEffect } from 'react'
import './LoginPopup.css'
import {assets} from '../../assets/assets'

const LoginPopup = ({setShowLogin}) => {
    const [currState, setCurrState] = useState("Sing Up")

    useEffect(() => {
        
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className='Login-Popup' >
            <form  className="Login-cont">
                <div className="Login-Title">
                    <h2>{currState}</h2>
                    <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="Login-Inputs">
                    {currState!=="Login" && <input type="text" placeholder='Your Name' required />}
                    <input type="email" placeholder='Your Email' required />
                    <input type="password" placeholder='Password' required />
                </div>
                <button>
                    {currState==="Sing Up" ? "Create Account" : "Login"}
                </button>
                <div className="Login-condition">
                    <input type="checkbox" required/>
                    <p>By creating an account, I consent to the processing of my personal data in accordance with the Privacy Policy</p>
                </div>
                {currState==="Login" 
                    ? <p>Create a new account? <span onClick={()=>setCurrState("Sing Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={()=>setCurrState("Login")}>Click here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
