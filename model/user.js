const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    age: Number,
    bio: String,
    image: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
