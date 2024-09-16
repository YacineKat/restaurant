
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createToken = (_id) => jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const token = createToken(user._id);
        res.json({ success: true, message: "Login successful", data: { user: { name: user.name, email: user.email }, token } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error", error: error.message });
    }
};

// Register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }
        if (!validator.isLength(password, { min: 8 })) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ name, email, password: hashPassword });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, message: "User registered successfully", data: { user: { name: user.name, email: user.email }, token } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error", error: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        await user.save();
        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: "Error updating profile", error: error.message });
    }
};

// Upload profile picture
const uploadProfilePicHandler = async (req, res) => {
    if (!req.file || !req.file.buffer || !req.file.originalname) {
        return res.status(400).json({ success: false, message: '1 لم يتم تحميل الملف', error: 'الملف غير موجود' });
    }

    const filePath = `${profilePicDir}/${req.file.originalname}`;

    try {
        await fs.promises.mkdir(profilePicDir, { recursive: true });
        await fs.promises.writeFile(filePath, req.file.buffer);
        res.json({ success: true, message: 'تم تحميل الملف بنجاح' });
    } catch (error) {
        console.error('Error writing file:', error);
        res.status(500).json({ success: false, message: 'خطأ في تحميل الملف', error: error.message });
    }
};


// Remove profile picture
const profilePicDir = path.join(__dirname, 'profile-pics');

const removeProfilePic = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const oldProfilePicUrl = user.profilePicUrl;
        user.profilePicUrl = '';
        await user.save();
        if (oldProfilePicUrl) {
            const filePath = path.join(profilePicDir, path.basename(oldProfilePicUrl));
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error removing profile picture:', error);
        res.status(500).json({ success: false, message: "Error removing profile picture", error: error.message });
    }
};

// Delete old profile picture
const deleteOldProfilePic = async (fileName) => {
    try {
        const filePath = path.join(__dirname, 'profile-pics', fileName);
        await fs.unlink(filePath);
        console.log('Old profile picture deleted successfully');
    } catch (err) {
        console.error('Error deleting old profile picture:', err);
    }
}

// Get profile picture
const getProfilePic = async (req, res) => {
    const user = await userModel.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profilePicUrl = user.profilePicUrl || 'https://static.hudl.com/users/temp/6338413_ca59a87698dd4fc6b52f63b83cd46b1e.png';

    if (user.profilePic) {
        res.set('Content-Type', 'image/png');
        res.send(user.profilePic.buffer);

        const img = document.createElement("img");
        img.src = `data:image/png;base64,${user.profilePic.toString("base64")}`;
        document.body.appendChild(img);

        return;
    }

    try {
        const imageData = await fs.promises.readFile(path.join(__dirname, '..', 'profile-pics', profilePicUrl));
        res.set('Content-Type', 'image/png');
        return res.send(imageData);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ success: false, message: 'Profile picture not found' });
        }
        console.error('Error getting profile picture:', error);
        return res.status(500).json({ success: false, message: 'Error getting profile picture' });
    }
};

export { loginUser, registerUser, updateUserProfile, uploadProfilePicHandler, removeProfilePic, getProfilePic };