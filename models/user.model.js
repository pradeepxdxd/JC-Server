import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: true,
    },
    lastname: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
    },
    profileImage: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    visiblity: {
        type: String,
        enum: ['PUBLIC', 'PRIVATE', 'PROTECTED'],
        default: 'PROTECTED'
    }
}, {
    timestamps: true
});

const userModel = mongoose.model('User', userSchema);
export default userModel;