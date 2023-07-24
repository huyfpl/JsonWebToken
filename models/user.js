const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
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
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    admin: {
        type: Boolean,
        default: false,

    },
},{
    timestamps: true // user đc tạo và updtae khi nào
}
);
module.exports = mongoose.model('User', userSchema);