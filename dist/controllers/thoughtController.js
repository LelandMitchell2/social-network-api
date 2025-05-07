import Thought from '../models/Thought.js';
import User from '../models/User.js';
export const getAllThoughts = async (_, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
export const getSingleThought = async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            res.status(404).json({ message: 'No thought found' });
            return;
        }
        res.json(thought);
        return;
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
export const createThought = async (req, res) => {
    try {
        const newThought = await Thought.create({
            thoughtText: req.body.thoughtText,
            username: req.body.username,
        });
        await User.findByIdAndUpdate(req.body.userId, {
            $push: { thoughts: newThought._id },
        });
        res.status(201).json(newThought);
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
};
export const updateThought = async (req, res) => {
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
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
};
export const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!thought) {
            res.status(404).json({ message: 'No thought found' });
            return;
        }
        res.json({ message: 'Thought deleted' });
        return;
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
export const addReaction = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $addToSet: { reactions: req.body } }, { new: true });
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        res.json(thought);
        return;
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
export const removeReaction = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true });
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        res.json(thought);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
