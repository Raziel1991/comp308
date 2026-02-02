import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
    platform: {
        type: String,
        required: true,
        trim: true,
    },
    releaseYear: {
        type: Number,
        required: true,
    },
    developer: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    }
},
    { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
