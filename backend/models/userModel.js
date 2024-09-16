
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: Buffer, required: false }, // حقل لتخزين الصورة
  cartData: { type: Array, default: [] },
});

const userModel = mongoose.model('User', userSchema);

export default userModel;