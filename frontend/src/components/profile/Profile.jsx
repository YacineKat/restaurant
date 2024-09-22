import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../storeContext/StoreContext";
import { assets } from "../../assets/assets";
import "./Profile.css";

// This component renders the profile page where the user can update their
// name, email, password, and profile picture.
const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    username,
    setUsername,
    profilePic,
    setProfilePic,
    selectedFile,
    setSelectedFile,
    token,
    url,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch the user's profile data from the server on mount.
  useEffect(() => {
    fetchUserProfile();
    fetchProfilePic();
    setName(username);
    // Set the preview URL to the user's current profile picture if one exists.
    if (profilePic) {
      setPreviewUrl(profilePic);
    }
    // Fetch the user's profile picture from the server if a token is present.
    if (token) {
      axios
        .get(`${url}/api/user/profile-pic`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            setProfilePic(response.data.profilePic);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [username, profilePic, token]);

  // Fetch the user's profile data from the server.
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${url}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = response.data;
      if (result.success) {
        setName(result.data.name);
        setEmail(result.data.email);
      } else {
        console.error("Failed to fetch user profile:", result.message);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Fetch the user's profile picture from the server.
  const fetchProfilePic = async () => {
    try {
      const response = await axios.get(`${url}/api/user/profile-pic`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setProfilePic(response.data.data.profilePicUrl);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  // Handle the form submission to update the user's profile data and
  // upload a new profile picture if one is selected.
  const handleUpdateAndUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {};
      if (name !== username) profileData.name = name;
      if (email !== setEmail) profileData.email = email;
      if (password) profileData.password = password;

      const profileResponse = await axios.put(
        `${url}/api/user/update-profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (profileResponse.data?.success) {
        setUsername(name);
        setEmail(email);
        setPassword("");
        toast.success("Profile updated successfully");
        navigate("/");
      } else {
        toast.error("Failed to update profile. No data returned.");
      }

      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const pictureResponse = await axios.post(
          `${url}/api/user/upload-profile-pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (pictureResponse.data?.success) {
          const profilePicUrl = pictureResponse.data?.data?.profilePicUrl;
          if (profilePicUrl) {
            localStorage.setItem("profilePic", profilePicUrl);
            setProfilePic(profilePicUrl);
            toast.success("Profile picture updated successfully");
            setPreviewUrl(profilePicUrl);
          } else {
            console.error("No profile picture URL found in response data");
          }
        } else {
          toast.error("Failed to upload profile picture. No data returned.");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      toast.error(`Error updating profile: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle the file input change event to set the selected image.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // Handle the profile picture change event to update the profile picture.
  const handleProfilePicChange = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("profilePic", selectedImage);

    try {
      const pictureResponse = await axios.post(
        "/api/user/updateProfilePic",
        formData
      );

      if (pictureResponse.data.success) {
        const profilePicUrl =
          pictureResponse.data.data && pictureResponse.data.data.profilePicUrl;
        if (profilePicUrl) {
          localStorage.setItem("profilePic", profilePicUrl);
          setProfilePic(profilePicUrl);
          toast.success("updated profile picture successfully");
          setPreviewUrl(profilePicUrl);
        } else {
          console.error("No profile picture URL found in response data");
        }
      } else {
        toast.error("Failed to update profile picture. No data returned.");
        console.error("No data in response:", pictureResponse.data);
      }
    } catch (error) {
      console.error(
        "Error updating profile picture:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        `An error occurred while updating profile picture: ${error.message}`
      );
    }
  };

  // Handle the delete profile picture button click event to delete the
  // profile picture.
  const handleDeletePicture = async () => {
    try {
      await axios.delete("/api/user/delete-profile-pic", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("profilePic"); //remove profile picture from local storage
      setProfilePic(""); // delate profile picture from state
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  return (
    <div className="Profile">
      <h1>Update Profile</h1>
      <div className="Profile-Pic">
        {selectedImage ? (
          <img src={selectedImage} alt="Preview" width="200" height="200" />
        ) : (
          <img
            src={'https://i.pinimg.com/originals/7e/8c/81/7e8c8119bf240d4971880006afb7e1e6.jpg'|| url+'/profile-pics/'+profilePic}
            alt=""
          />
        )}
      </div>
      <form className="Profile-Cont" onSubmit={handleUpdateAndUpload}>
        <div className="Profile-Form">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="Profile-Form">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="Profile-Form">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <h2>Change Profile Picture</h2>
        <div className="Profile-Pic-File">
          <button
            type="button"
            onClick={() => document.querySelector('input[type="file"]').click()}
          >
            Upload Picture
          </button>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div
          className="Profile-Submit"
          onSubmit={handleProfilePicChange && handleFileChange}
        >
          <button type="submit" name="image" disabled={loading}>
            {loading ? "Updating..." : "Update Profile & Upload Picture"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;