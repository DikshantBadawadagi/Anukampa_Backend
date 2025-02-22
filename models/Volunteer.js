import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
    ngoId: {
      type: String,
      required: false,
      default: ""
    },
    personalInfo: {
      fullname: {
        type: String,
        required: true
      },
      dateOfBirth: {
        type: Date,
        required: true
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Other'
      }
    },
    username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      phonenumber: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      alternateContactNumber: {
        type: String,
        default: null
      },
    locationInfo: {
      homeAddress: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      }
    },
    availability: {
      daysAvailable: {
        type: [String], // Example: ['Monday', 'Wednesday', 'Friday']
        required: true
      },
      hoursAvailable: {
        type: String, // Example: '9 AM - 5 PM'
        required: true
      },
      emergencyAvailability: {
        type: Boolean,
        default: false
      }
    },
    areasOfInterest: {
      type: [String], // Example: ['Animal rescue', 'Vet assistance', 'Shelter work']
      required: true
    },
    dateJoined: {
      type: Date,
      default: Date.now
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

  //Find Volunteer by email
volunteerSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

//Find volunteer by id
volunteerSchema.statics.findById = function (id) {
  return this.findOne({ _id: id });
};

  const Volunteer = mongoose.model('Volunteer', volunteerSchema);

  export default Volunteer;


  // TEST
  // {
  //   "personal_info": {
  //     "fullname": "Jane Smith",
  //     "date_of_birth": "1995-11-23",
  //     "gender": "Female"
  //   },
  //   "username": "jane_smith95",
  //   "password": "securepass456",
  //   "confirm_password": "securepass456",
  //   "contact_info": {
  //     "phone_number": "9876543210",
  //     "email_address": "janesmith@example.com",
  //     "alternate_contact_number": "0123456789"
  //   },
  //   "location_info": {
  //     "city": "Los Angeles",
  //     "state": "CA",
  //     "postal_code": "90001",
  //     "home_address": "5678 Oak Street"
  //   },
  //   "availability": {
  //     "days_available": ["Tuesday", "Thursday", "Saturday"],
  //     "hours_available": "10 AM - 6 PM",
  //     "emergency_availability": false
  //   },
  //   "areas_of_interest": ["Veterinary services", "Community outreach"],
  //   "date_joined": "2024-09-10",
  //   "cases": {
  //     "accepted_cases": 8,
  //     "declined_cases": 2
  //   }
  // }
  