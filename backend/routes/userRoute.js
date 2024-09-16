
import express from 'express';
import {
  loginUser,
  registerUser,
  updateUserProfile,
  uploadProfilePicHandler,
  removeProfilePic,
  getProfilePic,
} from '../controllers/userController.js';
import multer from 'multer';
import authenticateUser  from '../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import userModel  from '../models/userModel.js';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userRouter = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'profile-pics');
    // console.log(Creating directory: ${uploadPath});
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        if (err.code !== 'EEXIST') {
          console.error(Error`creating directory: ${err}`);
          return cb(err);
        }
        console.log(`Directory already exists: ${uploadPath}`);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter(req, file, cb) {
    if (!file || !file.originalname) {
      return cb(new Error('No file attached'));
    }

    const allowedExtensions = [/\.jpg$/, /\.jpeg$/, /\.png$/];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.some((extension) => extension.test(fileExtension))) {
      return cb(new Error('Only image files are allowed'));
    }

    cb(null, true);
  },
});

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.put('/update-profile', authenticateUser, updateUserProfile);
userRouter.delete('/remove-profile-pic', authenticateUser, removeProfilePic);
userRouter.get('/profile-pic', authenticateUser, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user || !user.profilePic) {
      return res.status(404).json({ success: false, message: 'Profile picture not found' });
    }

    res.set('Content-Type', 'image/png');
    res.send(user.profilePic); // إرسال الصورة المخزنة كـ Buffer
  } catch (error) {
    console.error('Error retrieving profile picture:', error);
    res.status(500).json({ success: false, message: 'Error retrieving profile picture' });
  }
});

userRouter.post('/upload-profile-pic', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // حفظ الصورة كـ Buffer في قاعدة البيانات
    user.profilePic = req.file.buffer;
    await user.save();

    res.json({ success: true, message: 'Profile picture uploaded successfully' });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ success: false, message: 'Error uploading profile picture' });
  }
});



export default userRouter;