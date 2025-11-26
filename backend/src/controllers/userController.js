import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

export async function register(req, res) {
  try {
    const { username, email, password, gamifiedName } = req.body;
    if (!username || !email || !password) return res.status(400).json({ success:false, message:'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success:false, message:'Email already used' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, gamifiedName });

    return res.json({ success:true, message:'User created', data:{ id:user._id } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false, message:'Registration failed' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, message:'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success:false, message:'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success:false, message:'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success:true, message:'Logged in', data:{ token } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false, message:'Login failed' });
  }
}

export async function getProfile(req, res) {
  try {
    const id = req.userId || req.user?.id;
    const user = await User.findById(id).select('-password');
    return res.json({ success:true, data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false, message:'Failed to get profile' });
  }
}