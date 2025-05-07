import { Schema, Document, model } from 'mongoose';
import { reactionSchema, IReaction } from './Reaction.js';


export interface IThought extends Document {
  thoughtText: string;
  createdAt: Date;
  username: string;
  reactions: IReaction[];
  reactionCount: number;
}

// Schema to create Thought model
// This schema is used as a subdocument in the User model
const thoughtSchema = new Schema<IThought>(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Virtual: reactionCount
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);
export default Thought;
