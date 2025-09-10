const mongoose = require("mongoose");

// Define the OTP schema
const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      sparse: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add index to ensure OTP codes expire
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create and export the model
const OTP = mongoose.model("OTP", otpSchema);

module.exports = { OTP }; 