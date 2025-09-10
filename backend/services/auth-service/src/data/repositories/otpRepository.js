const { logger } = require("../../middleware/logger");
const { OTP } = require("../models/OTP");

module.exports = class OTPRepository {
  async create(otpData) {
    return await OTP.create(otpData);
  }

  async findByUserId(userId) {
    return await OTP.findOne({ userId });
  }

  async findByContact({ email, phoneNumber }) {
    const query = {};
    if (email) query.email = email;
    if (phoneNumber) query.phoneNumber = phoneNumber;
    return await OTP.findOne(query);
  }

  async updateAttempts(otpId, incrementBy = 1) {
    return await OTP.findByIdAndUpdate(
      otpId,
      { $inc: { attempts: incrementBy } },
      { new: true }
    );
  }

  async verifyOTP(otpId) {
    return await OTP.findByIdAndUpdate(
      otpId,
      { isVerified: true },
      { new: true }
    );
  }

  async deleteById(otpId) {
    return await OTP.findByIdAndDelete(otpId);
  }

  async deleteByContact(email, phoneNumber) {
    const query = {};
    if (email) query.email = email;
    if (phoneNumber) query.phoneNumber = phoneNumber;
    return await OTP.deleteOne(query);
  }

  async deleteMany(query = {}) {
    logger.debug(`query: ${JSON.stringify(query)}`);
    return await OTP.deleteMany(query);
  }
}; 