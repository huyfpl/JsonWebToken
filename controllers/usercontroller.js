const User = require('../models/user');

const userController = {
    // get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteUser: async (req, res) => {
      try {
       const user= await User.findById(req.params.id);
       res.status(200).json("delete user successfully");
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
};
module.exports = userController;