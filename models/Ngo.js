import mongoose from "mongoose";
import Image from "./Image.js";

const ngoSchema = new mongoose.Schema({
    ngoName: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true
    },
    yearOfEstablishment: {
      type: Number,
      required: true,
    },
    primaryPhoneNumber: {
      type: String,
      required: true,
    },
    emergencyHelplineNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    alternateContactNumber: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    serviceArea: {
      type: String,
      required: true,
    },
      latitude: {
        type: Number,
        required: true,
        unique: true
      },
      longitude: {
        type: Number,
        required: true,
        unique: true
      },
    servicesProvided: {
      ambulance_service_availability: {
        type: Boolean,
        required: true,
      },
      animalShelter: {
        type: Boolean,
        required: true,
      },
      veterinaryServices: {
        type: Boolean,
        required: true,
      },
      specializedServices: {
        type: Boolean,
        required: true,
      },
    },
    resourceCapacity: {
      numberOfAmbulances: {
        type: Number,
        required: true,
      },
      veterinaryStaff: {
        type: Number,
        required: true,
      },
      shelterCapacity: {
        type: Number,
        required: true,
      },
    },
    operatingHours: {
      regular_hours: {
        type: String,
        required: true,
      },
      emergencyHours: {
        type: String,
        required: true,
      },
    },
    pointOfContact: {
      contactPersonName: {
        type: String,
        required: true,
        default: ""
      },
      role: {
        type: String,
        required: true,
        default: ""
      },
      directContactNumber: {
        type: String,
        required: true,
        default: ""
      },
      alternativeContact: {
        type: String,
        required: true,
        default: ""
      },
    },
    socialMedia: {
      website_url: {
        type: String,
        required: false,
        default: ""
      },
      facebook: {
        type: String,
        required: false,
        default: ""
      },
      twitter: {
        type: String,
        required: false,
        default: ""
      },
      instagram: {
        type: String,
        required: false,
        default: ""
      },
    },
    // cases: {
    //     acceptedCases: {
    //       type: Number,
    //       default: 0, // Initialize with 0
    //     },
    //     declinedCases: {
    //       type: Number,
    //       default: 0, // Initialize with 0
    //     }
    //   }
  });
  
  ngoSchema.methods.getVolunteers = async function() {
    const Volunteer = mongoose.model("Volunteer");
    return await Volunteer.find({ ngoId: this._id.toString() });
  };

  // Retrieve the count of volunteers for this NGO
ngoSchema.methods.getVolunteerCount = async function () {
  const Volunteer = mongoose.model("Volunteer");
  return await Volunteer.countDocuments({ ngoId: this._id.toString() });
};

// Update the NGO's operating hours
ngoSchema.methods.updateOperatingHours = async function (newRegular, newEmergency) {
  this.operatingHours.regular_hours = newRegular;
  this.operatingHours.emergencyHours = newEmergency;
  return this.save();
};

// Get a summary of the NGO's resource capacity
ngoSchema.methods.getTotalCapacity = function () {
  return {
    ambulances: this.resourceCapacity.numberOfAmbulances,
    staff: this.resourceCapacity.veterinaryStaff,
    shelter: this.resourceCapacity.shelterCapacity,
  };
};

//Find NGO's by email
ngoSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

//Find NGO by id
ngoSchema.statics.findById = function (id) {
  return this.findOne({ _id: id });
};

// Find NGOs by city (useful for filtering in a dashboard)
ngoSchema.statics.findByCity = function (city) {
  return this.find({ "address.city": city });
};

// Aggregate dashboard data (e.g., volunteer count per NGO)
ngoSchema.statics.getDashboardData = async function () {
  const Volunteer = mongoose.model("Volunteer");
  return await this.aggregate([
    {
      $lookup: {
        from: "volunteers",
        localField: "_id",
        foreignField: "ngoId",
        as: "volunteers",
      },
    },
    {
      $addFields: {
        volunteerCount: { $size: "$volunteers" },
      },
    },
    {
      $project: {
        ngoName: 1,
        registrationNumber: 1,
        volunteerCount: 1,
        serviceArea: 1,
        operatingHours: 1,
      },
    },
  ]);
};

// Update resource capacity for a given NGO
ngoSchema.statics.updateResourceCapacity = async function (ngoId, newCapacity) {
  return await this.findOneAndUpdate(
    { _id: ngoId },
    { $set: { resourceCapacity: newCapacity } },
    { new: true }
  );
};

ngoSchema.statics.findImagesWithinRadius = async function (ngoId, radiusInKm, status) {
  const ngo = await this.findById(ngoId);
  if (!ngo) throw new Error("NGO not found");

  const images = await Image.findImagesWithinRadius(
    ngo.latitude,
    ngo.longitude,
    radiusInKm,
    status
  );

  return images;
};

  
  const Ngo = mongoose.model("Ngo", ngoSchema);
  export default Ngo;


  // TEST

  // {
  //   "NGO_name": "Animal Welfare Society",
  //   "registration_number": "AWS12345",
  //   "year_of_establishment": 2010,
  //   "primary_phone_number": "9876543210",
  //   "emergency_helpline_number": "1122334455",
  //   "email_address": "contact@aws.org",
  //   "alternate_contact_number": "9988776655",
  //   "username": "animalwelfare",
  //   "password": "securePassword123",
  //   "confirm_password": "securePassword123",
  //   "address": {
  //     "street": "123 Green Lane",
  //     "city": "Mumbai",
  //     "state": "Maharashtra",
  //     "postal_code": "400001"
  //   },
  //   "service_area": "Mumbai Metropolitan Region",
  //   "geographical_coordinates": {
  //     "latitude": 19.076,
  //     "longitude": 72.8777
  //   },
  //   "services_provided": {
  //     "ambulance_service_availability": true,
  //     "animal_shelter": true,
  //     "veterinary_services": true,
  //     "specialized_services": false
  //   },
  //   "resource_capacity": {
  //     "number_of_ambulances": 5,
  //     "veterinary_staff": 10,
  //     "shelter_capacity": 50
  //   },
  //   "operating_hours": {
  //     "regular_hours": "9 AM - 6 PM",
  //     "emergency_hours": "24/7"
  //   },
  //   "point_of_contact": {
  //     "contact_person_name": "John Doe",
  //     "role": "Director",
  //     "direct_contact_number": "9876543211",
  //     "alternative_contact": "9988776644"
  //   },
  //   "social_media": {
  //     "website_url": "https://www.aws.org",
  //     "facebook": "https://facebook.com/aws",
  //     "twitter": "https://twitter.com/aws",
  //     "instagram": "https://instagram.com/aws"
  //   },
  //   "cases": {
  //     "accepted_cases": 120,
  //     "declined_cases": 15
  //   }
  // } 
  