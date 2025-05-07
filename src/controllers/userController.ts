import { Request, Response } from 'express';
import User from '../models/User.js';
import Thought from '../models/Thought.js';

// Gets all users
// GET /api/users
export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find().populate('thoughts').populate('friends');
    res.json(users);
  } catch (err) {
    console.error('catching error in getAllUsers', err);
    res.status(500).json({ error: err });
  }
};

// Gets a single user by ID
// GET /api/users/:userId
export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).populate('thoughts').populate('friends');
    if (!user) {
      res.status(404).json({ message: 'No user found' });
      return;
    }
    res.json(user);
    return;
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Creates a new user
// POST /api/users
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

// Updates a user by ID
// PUT /api/users/:userId
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404).json({ message: 'No user found' });
      return;
    }
    res.json(user);
    return;
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

// Deletes a user by ID
// DELETE /api/users/:userId
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      res.status(404).json({ message: 'No user found' });
      return;
    }

    // BONUS: delete user's thoughts
    await Thought.deleteMany({ _id: { $in: user.thoughts } });
    res.json({ message: 'User and thoughts deleted!' });
    return;
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Adds a friend to a user's friend list
// POST /api/users/:userId/friends/:friendId
export const addFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
    return;
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Removes a friend from a user's friend list
// DELETE /api/users/:userId/friends/:friendId
export const removeFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
    return;
  } catch (err) {
    res.status(500).json({ error: err });
  }
};