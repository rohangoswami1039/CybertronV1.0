const { logger } = require("../../middleware/logger");
const { User } = require("../models/User");

module.exports = class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findByPhoneNumber(phoneNumber) {
    return await User.findOne({ phoneNumber });
  }

  async findByFirebaseUid(firebaseUid) {
    return await User.findOne({ firebaseUid });
  }

  async updateById(id, update) {
    logger.debug(`Id: ${id}`);
    logger.debug(`Update: ${update}`);
    return await User.findByIdAndUpdate(id, update, { new: true });
  }

  async updateByFirebaseUid(
    firebaseUid,
    update,
    options = { new: true, upsert: true, setDefaultsOnInsert: true }
  ) {
    return await User.findOneAndUpdate(
      { firebaseUid },
      { $set: update },
      options
    );
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByIdWithPassword(id) {
    return await User.findById(id).select("+password");
  }

  async findByEmailOrPhoneWithPassword({ email, phoneNumber }) {
    logger.debug(`Email: ${email}`);
    logger.debug(`Phone Number: ${phoneNumber}`);
    let query = {};

    if (email && email.trim()) {
      query.email = email.trim();
    } else if (phoneNumber && phoneNumber.trim()) {
      query.phoneNumber = phoneNumber.trim();
    } else {
      throw new Error("Either email or phone number is required");
    }

    logger.debug("Finding user with query:", query);

    try {
      const user = await User.findOne(query).select("+password");
      logger.debug(`User found: ${user ? "Yes" : "No"}`);
      return user;
    } catch (error) {
      logger.error(`Database query error: ${error.message}`);
      throw error;
    }
  }
}; 