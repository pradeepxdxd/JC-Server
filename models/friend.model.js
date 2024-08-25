import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    friendId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    accept: {
        type: Boolean,
        default: false
    },
    viewed: {
        type: Boolean,
        default: false
    },
    block: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export default mongoose.model('friend', friendSchema);