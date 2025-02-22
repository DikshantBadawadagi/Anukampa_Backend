import mongoose from "mongoose";
import Image from "./Image.js";
import { HTTP_SUCCESS } from "../utils.js";
import ApiError from "../error.js";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    contactInfo: {
        phone:{
            type: String,
            default:""
        },
        email:{
            type:String,
            default:"",
        }
    }
},{
    timestamps: true
})

userSchema.statics.findByUserId = async function (id) {
    return await this.findById(id);
};

userSchema.statics.createUser = async function (userData = {}) {
    try {
        const newUser = new this({ ...userData });
        await newUser.save();

        return newUser;

    } catch (error) {
        console.log(error);
        
        throw new ApiError(500, "Error creating user", error.errors || []);
    }
};


userSchema.statics.getUserImages = async function (userId) {
    return await Image.find({ userId }).sort({ createdAt: -1 }); // Latest images first
};

const User = mongoose.model("User", userSchema);

export default User