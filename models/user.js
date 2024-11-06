const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // You can remove the password field here, as passport-local-mongoose handles it
    // password: {
    //     type: String,
    //     required: true
    // },
    profileImage: {
        type: String,
        default: "https://example.com/default-profile.png" // Default profile image
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add passport-local-mongoose plugin to the user schema
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'username', // Use 'username' for authentication
    // You can add other options here if needed
});

const User = mongoose.model("User", userSchema);
module.exports = User;
