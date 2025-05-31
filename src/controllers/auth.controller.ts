import User from "../models/user.model"; ;
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: 'Email already exists' });

  const hash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hash });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!);
  res.status(201).json({ newUser,token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
  res.status(200).json({ token });
};
