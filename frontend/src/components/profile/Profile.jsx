import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../storeContext/StoreContext';
import { assets } from '../../assets/assets';

const ProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const { username, setUsername, token, url, profilePic, userProfile,setProfilePic } = useContext(StoreContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserProfile();
        fetchProfilePic();
        setName(username);
    }, [username]);
    

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${url}/api/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = response.data;
            if (result.success) {
                setName(result.data.name);
                setEmail(result.data.email);
            } else {
                console.error('Failed to fetch user profile:', result.message);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };
    
    

    const fetchProfilePic = async () => {
        try {
            const response = await axios.get(`${url}/api/user/profile-pic`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setProfilePic(response.data.data.profilePicUrl);
                setPreviewUrl(response.data.data.profilePicUrl); // Set the preview URL to the current profile picture
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };


    const handleUpdateAndUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const profileData = {};
            if (name !== username) profileData.name = name;
            if (email !== setEmail) profileData.email = email;
            if (password) profileData.password = password;
    
            const profileResponse = await axios.put(`${url}/api/user/update-profile`, profileData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (profileResponse.data?.success) {
                setUsername(name);
                setEmail(email);
                setPassword('');
                toast.success('Profile updated successfully');
            } else {
                toast.error('Failed to update profile. No data returned.');
            }
    
            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);
    
                const pictureResponse = await axios.post(`${url}/api/user/upload-profile-pic`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                if (pictureResponse.data?.success) {
                    const profilePicUrl = pictureResponse.data?.data?.profilePicUrl;
                    if (profilePicUrl) {
                        setProfilePic(profilePicUrl);
                        toast.success('Profile picture updated successfully');
                        setPreviewUrl(profilePicUrl);
                    } else {
                        console.error('No profile picture URL found in response data');
                    }
                } else {
                    toast.error('Failed to upload profile picture. No data returned.');
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
            toast.error(`Error updating profile: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPreviewUrl(URL.createObjectURL(file));
        setSelectedFile(file);
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // عرض الصورة في المعاينة
        }
    };
    
    const handleProfilePicChange = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('profilePic', selectedImage);
    
        try {
            const pictureResponse = await axios.post('/api/user/updateProfilePic', formData);
            
            if (pictureResponse.data.success) {
                const profilePicUrl = pictureResponse.data.data && pictureResponse.data.data.profilePicUrl;
                if (profilePicUrl) {
                    setProfilePic(profilePicUrl);
                    toast.success('updated profile picture successfully');
                    setPreviewUrl(profilePicUrl);
                } else {
                    console.error('No profile picture URL found in response data');
                }
            } else {
                toast.error('Failed to update profile picture. No data returned.');
                console.error('No data in response:', pictureResponse.data);
            }
        } catch (error) {
            console.error('Error updating profile picture:', error.response ? error.response.data : error.message);
            toast.error(`An error occurred while updating profile picture: ${error.message}`);
        }
    };

    
    
    const handleDeletePicture = async () => {
        try {
            await axios.delete('/api/user/delete-profile-pic', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfilePic(""); // مسح صورة البروفايل
            localStorage.removeItem('profilePic'); // إزالة من localStorage
        } catch (error) {
            console.error('Error deleting profile picture:', error);
        }
    };



    return (
        <div>
            <h1>Update Profile</h1>
            <div>
                {selectedImage ? (
                    <img src={selectedImage} alt="Preview" width="200" height="200" />
                ) : (
                    <img src={profilePic || assets.profile_icon} alt="Profile" width="200" height="200" />
                )}
            </div>
            <form onSubmit={handleUpdateAndUpload}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <h2>Change Profile Picture</h2>
                <div>

                    {/* عرض صورة المعاينة إذا تم اختيار صورة جديدة */}
                    {/* {previewUrl ? 
                        <img src={previewUrl} alt="Preview" style={{ width: '100px', height: '100px'   }} />
                     : (
                         <p>No image selected</p>
                    )} */}

                    {/* <input type="file" onChange={handleFileUpload} /> */}
                    <input type="file" onChange={(e) => handleFileChange(e)} />
                    
                    {selectedFile && (
                        <button type="button" onClick={handleDeletePicture}>Delete Profile Picture</button>
                    )}
                    {/* عرض الصورة الحالية أو الصورة الافتراضية
                    // {profilePic ? (
                        // <img src={profilePic} alt="Profile" style={{ width: '100px', height: '100px' }} />
                    // ) : (
                        // <p>No profile picture</p>
                    )} */}
                </div>

                <div onSubmit={handleProfilePicChange}>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile & Upload Picture'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;

