import { Request, Response } from 'express';
import Thought from '../models/Thought.js';
import User from '../models/User.js';

// Gets all thoughts
// GET /api/thoughts
export const getAllThoughts = async (_: Request, res: Response) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Gets a single thought by ID
// GET /api/thoughts/:thoughtId
export const getSingleThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      res.status(404).json({ message: 'No thought found' });
      return;
    }
    res.json(thought);
    return;
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Creates a new thought
// POST /api/thoughts
export const createThought = async (req: Request, res: Response) => {
  try {
    const newThought = await Thought.create({
      thoughtText: req.body.thoughtText,
      username: req.body.username,
    });

    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: newThought._id },
    });

    res.status(201).json(newThought);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

// Updates a thought by ID
// PUT /api/thoughts/:thoughtId
export const updateThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!thought) {
      res.status(404).json({ message: 'No thought found' });
      return;
    }
    res.json(thought);
    return;
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

// Deletes a thought by ID
// DELETE /api/thoughts/:thoughtId
export const deleteThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
    if (!thought) {
      res.status(404).json({ message: 'No thought found' });
      return;
    }
    res.json({ message: 'Thought deleted' });
    return;
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Adds a reaction to a thought
// POST /api/thoughts/:thoughtId/reactions
export const addReaction = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $addToSet: { reactions: req.body } },
      { new: true }
    );
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(thought);
    return;
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Deletes a reaction from a thought
// DELETE /api/thoughts/:thoughtId/reactions/:reactionId
export const removeReaction = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};