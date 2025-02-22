import bcrypt from "bcryptjs";
import ApiError from "../error.js";
import jwt from "jsonwebtoken";
import { HTTP_SUCCESS, HTTP_CREATED, HTTP_NO_CONTENT } from "../utils.js";
import Volunteer from "../models/Volunteer.js";

export const signup = async (req, res, next) => {
    console.log(req.body);
    
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newVolunteer = new Volunteer({...req.body,password:hash});
        await newVolunteer.save();
        if(!newVolunteer) {
            throw new ApiError(500, "Something went wrong")
        }
        HTTP_SUCCESS(res, "Volunteer has been registered");
        }catch(err){
        return next(err);
    }
};

export const signin = async (req, res, next) => {
    console.log(req.body);
    
    try{
        const volunteer = await Volunteer.findByEmail({email:req.body.email});
        if(!volunteer) {
            throw new ApiError(404, "Ngo not found")
        } 
        
        const isCorrect = await bcrypt.compare(req.body.password, volunteer.password);
        if(!isCorrect) {
            throw new ApiError(400, "Wrong username or password")
        }

        const token = jwt.sign({id: ngo._id}, process.env.JWT)

        const {password, ...others} = volunteer._doc;

        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(others);


    }catch(err){
        return next(err);    
    }
};

