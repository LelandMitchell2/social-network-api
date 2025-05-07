import User from '../models/User.js';
import Thought from '../models/Thought.js';
import { connectDB } from '../config/connection.js';
import { generateUsers, generateThoughts, addRandomFriends, } from '../utils/data.js';
const seedDatabase = async () => {
    await connectDB();
    console.log('🔄 Clearing existing data...');
    await User.deleteMany({});
    await Thought.deleteMany({});
    console.log('⚙️ Generating users...');
    const rawUsers = generateUsers();
    const usersWithFriends = addRandomFriends(rawUsers);
    await User.insertMany(usersWithFriends);
    console.log('🧠 Generating thoughts and reactions...');
    const thoughts = generateThoughts(usersWithFriends);
    await Thought.insertMany(thoughts);
    // Link thought _ids back to users
    for (const thought of thoughts) {
        await User.findByIdAndUpdate(thought.userId, {
            $addToSet: { thoughts: thought._id },
        });
    }
    console.log('✅ Seeding complete!');
    process.exit(0);
};
seedDatabase().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
