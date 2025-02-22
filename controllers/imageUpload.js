import express from "express";
const router = express.Router();
import cloudinary from "../cloudinary.js";
import upload from "../middleware/multer.js";

 router.post('/upload', upload.single('image'), function (req, res) {
  cloudinary.uploader.upload(req.file.path, function (err, result){
    if(err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error"
      })
    }

    res.status(200).json({
      success: true,
      message:"Uploaded!",
      data: result
    })
  })
});

module.exports = router;