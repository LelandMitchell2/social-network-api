import { Schema, Document, Types } from 'mongoose';
import mongoose from 'mongoose';

// Interface for User model
// This interface defines the structure of the User document
interface IUser extends Document {
  username: string;
  email: string;
  thoughts: Types.ObjectId[];
  friends: Types.ObjectId[];
  friendCount: number;
}

// Schema to create User model
// This schema is used as a subdocument in the Thought model
const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must match a valid email address'],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Virtual: friendCount
userSchema.virtual('friendCount').get(function (this: IUser) {
  return this.friends.length;
});

const User = mongoose.model('User', userSchema);

export default User;
