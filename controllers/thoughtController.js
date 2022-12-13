const { Thought, User } = require('../models');

const thoughtController= {
  // Function to get all of the thoughts by invoking the find() method with no arguments.
  // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
  getThoughts(req, res) {
    Thought.find()
      .then((dataThought) => {
        res.json(dataThought);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  // Gets a single thought using the findOneAndUpdate method. We pass in the ID of the thought and then respond with it, or an error if not found
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((dataThought) => {
        if (!dataThought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
          res.json(dataThought);
  })
      .catch((err) => {
        res.status(500).json(err);
  });
},
  // Creates a new Thought. Accepts a request body with the entire thought object.
  // Because thoughts are associated with Users, we then update the User who created the thought and add the ID of the thought to the thought array
createThought (req, res) {
    Thought.create(req.body)
      .then((dataThought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: dataThought._id } },
          { new: true }
        );
      })
      .then((dataThought) => {
        if (!dataThought) {
          return res.status(404).json({
              message: 'Thought created, but found no user with that ID' });
            }
         res.json({ message: 'Created the thought 🎉' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Update thoughts using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((dataThought) => {
        if (!Thought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(dataThought);
  })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Deletes a thought from the database. Looks for a thought by ID.
  // Then if the thought exists, we look for any users associated with the thought based on he app ID and update the applications array for the User.
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((dataThought) => {
        if (!dataThought) {
          return res.status(404).json({ message: 'No thought with this id!' });
      }
        
      return User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            );
  })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
              message: 'Thought created but no user with this id!' });
            }
          res.json({ message: 'Thought successfully deleted!' });
          })
      .catch((err) => {
        res.status(500).json(err);
  });
},

addReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body } },
    { runValidators: true, new: true }
  )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
},
// remove reaction from a thought
removeReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { runValidators: true, new: true }
  )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
},
};


module.exports = thoughtController