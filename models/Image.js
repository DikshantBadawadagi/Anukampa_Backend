import mongoose from "mongoose";

const imageSchema = new mongoose.Schema ( {
    userId: {
        type: String,
        required: true
    },
    imgUrl:{
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true,
      },
    longitude: {
        type: Number,
        required: true,
      },
    predInjury: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved"],
        default: "Pending",
      },
    // actualInjury: {
    //     type: String,
    // }
},
{
    timestamps: true
}
);

//find image by id
imageSchema.statics.findByImageId = async function (id) {
    return await this.findById(id);
};

// Static method to find images within a radius from a given lat/long
imageSchema.statics.findImagesWithinRadius = async function (latitude, longitude, radiusInKm, status) {
    // Fetch images with the specified status (or all if status is not provided)
    const query = status ? { status } : {};
    const images = await this.find(query);
  
    // Filter images by distance using Haversine formula
    const filteredImages = images.filter((image) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        image.latitude,
        image.longitude
      );
      return distance <= radiusInKm;
    });
  
    return filteredImages;
  };
  
  // Haversine formula to calculate distance (in kilometers)
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

const Image = mongoose.model("Image", imageSchema);

export default Image;