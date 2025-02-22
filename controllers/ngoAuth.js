import bcrypt from "bcryptjs";
import ApiError from "../error.js";
import jwt from "jsonwebtoken";
import { HTTP_SUCCESS, HTTP_CREATED, HTTP_NO_CONTENT } from "../utils.js";
import Ngo from "../models/Ngo.js";

export const signup = async (req, res, next) => {
    console.log(req.body);
    
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newNgo = new Ngo({...req.body,password:hash});
        await newNgo.save();
        if(!newNgo) {
            throw new ApiError(500, "Something went wrong")
        }

        HTTP_CREATED(res);
        }catch(err){
        return next(err);
    }
};

export const signin = async (req, res, next) => {
    console.log(req.body);
    
    try{
        const { email } = req.body;
        const ngo = await Ngo.findByEmail(email);
        if(!ngo) {
            throw new ApiError(404, "Ngo not found")
        } 
        
        const isCorrect = await bcrypt.compare(req.body.password, ngo.password);
        if(!isCorrect) {
            throw new ApiError(400, "Wrong username or password")
        }

        const token = jwt.sign({id: ngo._id}, process.env.JWT)

        const {password, ...others} = ngo._doc;

        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(others);


    }catch(err){
        return next(err);    
    }
};

