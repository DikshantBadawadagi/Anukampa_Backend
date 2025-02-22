import { HTTP_SUCCESS } from "../utils.js";
import Ngo from "../models/Ngo.js"; 
import Report from "../models/Report.js";
import Image from "../models/Image.js";
import ApiError from "../error.js";


export const getImagesWithinRadius = async (req, res, next) => {
  try {
    const ngoId = req.user.id;
    const radiusInKm = parseFloat(req.query.radius); 
    const status = req.query.status; 

    if (!radiusInKm || radiusInKm <= 0) {
      return next(new ApiError(400, "Please provide a valid radius in kilometers"));
    }

    const validStatuses = ["Pending", "In Progress", "Resolved"];
    if (status && !validStatuses.includes(status)) {
      return next(new ApiError(400, "Invalid status value. Use Pending, In Progress, or Resolved"));
    }

    const images = await Ngo.findImagesWithinRadius(ngoId, radiusInKm, status);

    HTTP_SUCCESS(res, images, "Images fetched successfully");
  } catch (err) {
    next(new ApiError(500, err.message || "Failed to fetch images"));
  }
};

export const acceptImage = async (req, res, next) => {
    try {
      const ngoId = req.user.id; 
      const imageId = req.params.imageId;
  
      const existingReport = await Report.findOne({ imageId });
      if (existingReport && existingReport.isTaken) {
        return next(new ApiError(400, "This image has already been taken by another report"));
      }
  
      const image = await Image.findByImageId(imageId);
      if (!image) {
        return next(new ApiError(404, "Image not found"));
      }
  
      const report = await Report.acceptImageReport(ngoId, imageId, image.predInjury);
  
      await Image.findByIdAndUpdate(imageId, { status: "In Progress" });
  
      HTTP_SUCCESS(res, report, "Image accepted successfully");
    } catch (err) {
      next(new ApiError(500, err.message || "Failed to accept image"));
    }
  };

  export const assignVolunteer = async (req, res, next) => {
    try {
      const ngoId = req.user.id;
      const volunteerId = req.params.volunteerId;
      const imageId = req.body.imageId;
  
      if (!volunteerId || typeof volunteerId !== "string") {
        return next(new ApiError(400, "Invalid volunteer ID"));
      }
  
      const updatedReport = await Report.assignVolunteer(volunteerId, imageId);
  
      HTTP_SUCCESS(res, updatedReport, "Volunteer assigned successfully");
    } catch (err) {
      next(new ApiError(500, err.message || "Failed to assign volunteer"));
    }
  };

  export const getAllByStatus = async (req, res, next) => {
    try {
      const status = req.query.status;
      const ngoId = req.user.id; 

      if (!status || !["Pending", "In Progress", "Resolved"].includes(status)) {
        return next(new ApiError(400, "Invalid status value. Use Pending, In Progress, or Resolved"));
      }

      const reports = await Report.getAllByStatus(ngoId, status);

      HTTP_SUCCESS(res, reports, "Reports fetched successfully");

    }catch(err){
      next(new ApiError(500, err.message || "Failed to fetch images"));
    }
  };

  export const getAllVolunteers = async (req, res, next) => {
    try {
      const ngoId = req.user.id;

      const ngo = await Ngo.findById(ngoId);

      if (!ngo) {
        return next(new ApiError(404, "NGO not found"));
      }

      const volunteers = await ngo.getVolunteers();

      HTTP_SUCCESS(res, volunteers, "Volunteers fetched successfully");
    }catch(err){
      next(new ApiError(500, err.message || "Failed to fetch volunteers"));
    }
  };