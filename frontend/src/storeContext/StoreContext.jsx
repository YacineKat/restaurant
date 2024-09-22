import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { food_list as initialFoodList } from '../assets/assets';

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState({});
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [cartItem, setCartItem] = useState({});
    const [food_list, setFoodList] = useState(initialFoodList);
    const url = 'https://restaurant-frontend-x0b2.onrender.com';

    useEffect(() => {
        fetchUserProfile();
        if (localStorage.getItem('profilePic')) {
            setPreviewUrl(localStorage.getItem('profilePic'));
        } else {
            fetchProfilePic();
        }
    }, [username]);

    useEffect(() => {
        fetchUserProfile();
        if (localStorage.getItem('profilePic')) {
            setProfilePic(localStorage.getItem('profilePic'));
        }
        if (localStorage.getItem('username')) {
            setUsername(localStorage.getItem('username'));
        }
        if (localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
        }
        const savedProfilePic = localStorage.getItem('profilePic');
        if (savedProfilePic) {
            setProfilePic(savedProfilePic);
        }
    }, []);

    useEffect(() => {
        const fetchFoodList = async () => {
            try {
                const response = await axios.get(`${url}/api/food-list`);
                if (response.data.success) {
                    setFoodList(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching food list:', error);
            }
        };

        fetchFoodList();
    }, [url]);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('/api/user/profile');
            const data = response.data;
            if (data) {
                setUserProfile(data);
                if (data.profilePic) {
                    setProfilePic(data.profilePic);
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchProfilePic = async () => {
        try {
            const response = await axios.get(`${url}/api/user/profile-pic`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setProfilePic(response.data.data.profilePicUrl);
                localStorage.setItem('profilePic', response.data.data.profilePicUrl);
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };

    const updateUsername = (newUsername) => {
        setUsername(newUsername);
        localStorage.setItem('username', newUsername);
    };

    const updateProfilePic = (newProfilePic) => {
        setProfilePic(newProfilePic);
        localStorage.setItem('profilePic', newProfilePic);
    };

    const addToCart = (id) => {
        !cartItem[id] ? setCartItem((prev) => ({ ...prev, [id]: 1 })) : setCartItem((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    };

    const removeFromCart = (id) => {
        setCartItem((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    };

    const getTotalCartAmount = () => {
        let total = 0;
        for (const item in cartItem) {
            if (cartItem[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                total += itemInfo.price * cartItem[item];
            }
        }
        return total;
    };

    const contextValue = {
        food_list,
        cartItem,
        setCartItem,
        getTotalCartAmount,
        addToCart,
        removeFromCart,
        url,
        token,
        setToken: (newToken) => {
            localStorage.setItem('token', newToken);
            setToken(newToken);
        },
        username,
        setUsername: updateUsername,
        profilePic,
        setProfilePic: updateProfilePic,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;

