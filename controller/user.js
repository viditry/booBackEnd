const User  = require('../model/user');


const createUser = async (req, res) => {
    try {
        const { name, age, bio, image } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ name });
        if (user) {
            return res.status(409).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            age,
            bio,
            image // This will be a default image if not provided
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
};

module.exports = {
    createUser,
    getUserById
};
