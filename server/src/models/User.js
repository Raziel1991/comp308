import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 18,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    gamesOwned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
    }],
},
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
