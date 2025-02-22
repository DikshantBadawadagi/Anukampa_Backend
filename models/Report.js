import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  isTaken: {
    type: Boolean,
    required: true,
    default: false
  },
  volunteerId: {
    type: "String",
    required: true,
    default: "",
  },
  isAffiliated: {
    type: Boolean,
    required: true,
    default: false,
  },
  ngoId: {
    type: "String",
    required: false,
    default: "",
  },
  imageId: {
    type: "String",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending",
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

reportSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

//assign the report to a volunteer
reportSchema.statics.assignVolunteer = async function (ngoId, volunteerId) {
  // Find a report associated with the NGO (e.g., one that’s in progress and taken)
  const report = await this.findOne({ ngoId, isTaken: true, status: "In Progress" });
  if (!report) {
    throw new Error("No suitable report found for this NGO to assign");
  }

  // Update the volunteerId
  return await this.findByIdAndUpdate(
    report._id,
    { volunteerId, updatedAt: Date.now() },
    { new: true }
  );
};

// Static method to accept an image (update existing or create new)
reportSchema.statics.acceptImageReport = async function (ngoId, imageId, description) {
  const existingReport = await this.findOne({ imageId });

  if (existingReport) {
    // Update existing report
    return await this.findByIdAndUpdate(
      existingReport._id,
      {
        ngoId,
        isTaken: true,
        status: "In Progress",
        description,
        updatedAt: Date.now(),
      },
      { new: true }
    );
  } else {
    // Create new report
    return await new this({
      isTaken: true,
      volunteerId: "",
      isAffiliated: false,
      ngoId,
      imageId,
      status: "In Progress",
      description,
    }).save();
  }
};

//find by report id
reportSchema.statics.findByReportId = async function (id) {
  return await this.findById(id);
};

reportSchema.statics.findByVolunteer = function (volunteerId) {
  return this.find({ volunteerId });
};

reportSchema.statics.findByNGO = function (ngoId) {
  return this.find({ ngoId });
};

reportSchema.statics.updateStatus = async function (reportId, newStatus) {
  return this.findOneAndUpdate(
    { _id: reportId },
    { status: newStatus, updatedAt: Date.now() },
    { new: true }
  );
};

// Instance methods (unchanged)
reportSchema.methods.markResolved = function () {
  this.status = "Resolved";
  this.updatedAt = Date.now();
  return this.save();
};

reportSchema.methods.addDescription = function (additionalDescription) {
  this.description += additionalDescription;
  this.updatedAt = Date.now();
  return this.save();
};

reportSchema.methods.toggleIsTaken = function () {
  this.isTaken = !this.isTaken;
  this.updatedAt = Date.now();
  return this.save();
};

reportSchema.methods.isPending = function () {
  return this.status === "Pending";
};
  
  const Report = mongoose.model("Report", reportSchema);
  
  export default Report;