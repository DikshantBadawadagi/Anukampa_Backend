import ApiError from "../error.js";
import Image from "../models/Image.js";
import User from "../models/User.js";
import { HTTP_SUCCESS } from "../utils.js";
import cloudinary from "../cloudinary.js";
import upload from "../middleware/multer.js";

export const addImage = async (req,res,next) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const newImage = new Image({
            userId: req.user._id,
            imgUrl: result.secure_url,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            predInjury: req.body.predInjury,
            // actualInjury: req.body.actualInjury
        });
        const savedImage = await newImage.save();
        if(!savedImage){
            throw new ApiError(500,"Error saving image");
        }
        HTTP_SUCCESS(res, savedImage, "Image saved successfully");
    } catch (error) {
        next(error);
    }
};

export const testImage = async (req, res) => {
    res.status(200).json({ message: "Image uploaded successfully" });
}