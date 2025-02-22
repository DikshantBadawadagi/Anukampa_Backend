import express from "express";
import { acceptImage, assignVolunteer, getImagesWithinRadius } from "../controllers/ngoUser.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//assign operation to volunteer
router.put("/assign/:volunteerId",verifyToken,assignVolunteer);

//unassign operation to volunteer
router.put("/unassign/:volunteerId",verifyToken,);

//get all volunteers
router.get("/volunteers",verifyToken,);

//add a volunteer to the ngo
router.post("/addvolunteer/:volunteerId",verifyToken,);

//remove a volunteer from the ngo
router.delete("/removevolunteer/:volunteerId",verifyToken,);

//get all cases in the given radius
router.get("/cases/nearby", verifyToken, getImagesWithinRadius);

//accept an image
router.post("/accept/:imageId",verifyToken,acceptImage);

export default router;