const { Schema, model } = require('mongoose');

// Schema to create Post model
const thoughtSchema = new Schema(
  {
  thoughtText: String,
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user', 
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

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;

