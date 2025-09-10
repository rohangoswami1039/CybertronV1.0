const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { logger } = require('../middleware/logger');
const { User, OTP, Transaction } = require('../data/models');
const { sendEmail } = require('../utils/emailService');
const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const { firebaseService } = require("../utils/firebase");
const UserRepository = require("../data/repositories/userRepository");
const OTPRepository = require("../data/repositories/otpRepository");

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "dev-secret";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
    this.useMock = process.env.USE_MOCK === "true";
    this.userRepo = new UserRepository();
    this.otpRepo = new OTPRepository();
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      throw new AuthenticationError("Invalid or expired token");
    }
  }

  getTokensForPlan(planType) {
    const tokenAllocations = {
      free: 1000,
      pro: 10000,
      enterprise: 100000,
    };
    return tokenAllocations[planType] || 1000;
  }

  async getCurrentUser(contextUser) {
    if (!contextUser) {
      throw new AuthenticationError(
        "You must be logged in to perform this action"
      );
    }

    let user;

    if (contextUser.uid) {
      user = await this.userRepo.findByFirebaseUid(contextUser.uid);
    } else if (contextUser.id) {
      user = await this.userRepo.findById(contextUser.id);
    } else {
      throw new Error("No valid user identifier found");
    }

    if (!user) {
      throw new Error("User not found in database");
    }

    return {
      id: user._id.toString(),
      firebaseUid: user.firebaseUid,
      email: user.email,
      phoneNumber: user.phoneNumber,
      displayName: user.displayName,
      avatar: user.avatar,
      
      // Account Status
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      
      // Plan & Subscription Information
      planType: user.planType,
      selectedPlan: user.selectedPlan,
      planDuration: user.planDuration,
      paymentProvider: user.paymentProvider,
      
      // Token Management
      availableTokens: user.availableTokens,
      totalTokensConsumed: user.totalTokensConsumed,
      
      // Profile & Occupation
      occupation: user.occupation,
      occupationDescription: user.occupationDescription,
      accountPurposes: user.accountPurposes,
      accountType: user.accountType,
      
      // Billing Information
      billingInfo: user.billingInfo,
      
      // Security & Login
      lastLoginAt: user.lastLoginAt,
      loginAttempts: user.loginAttempts,
      isLocked: user.isLocked,
      
      // Timestamps
      emailVerifiedAt: user.emailVerifiedAt,
      phoneVerifiedAt: user.phoneVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      
      // Metadata
      signupSource: user.signupSource,
      referrer: user.referrer,
    };
  }

  async createInitialUser(input) {
    try {
      if (!input.firebaseUid) {
        throw new UserInputError("Firebase UID is required");
      }

      // Convert empty strings to undefined
      const cleanEmail =
        input.email && input.email.trim() !== "" ? input.email : undefined;
      const cleanPhoneNumber =
        input.phoneNumber && input.phoneNumber.trim() !== ""
          ? input.phoneNumber
          : undefined;

      const initialUserData = {
        firebaseUid: input.firebaseUid,
        email: cleanEmail,
        phoneNumber: cleanPhoneNumber,
        displayName: input.displayName || "User",
        isEmailVerified: cleanEmail ? true : false,
        isPhoneVerified: cleanPhoneNumber ? true : false,
        // Default values for incomplete profile
        planType: "free",
        selectedPlan: "free",
        planDuration: "MONTHLY",
        paymentProvider: "none",
        accountType: "INDIVIDUAL",
        availableTokens: 1000, // Starter tokens
        totalTokensConsumed: 0,
        isActive: true,
        signupSource: "firebase",
      };
      const options = { new: true, upsert: true, setDefaultsOnInsert: true };

      const user = await this.userRepo.updateByFirebaseUid(
        input.firebaseUid,
        initialUserData,
        options
      );

      // Generate token for immediate access
      const token = this.generateToken(user);
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      logger.info(`Initial user created: ${user._id}`);

      return {
        user: userWithoutPassword,
        token,
        requiresOTP: false,
        isProfileComplete: false,
      };
    } catch (error) {
      logger.error(`Initial user creation error: ${error.message}`);
      throw error;
    }
  }

  async completeProfile(input) {
    try {
      if (!input.firebaseUid) {
        throw new UserInputError("Firebase UID is required");
      }

      // Convert empty strings to undefined
      const cleanEmail =
        input.email && input.email.trim() !== "" ? input.email : undefined;
      const cleanPhoneNumber =
        input.phoneNumber && input.phoneNumber.trim() !== ""
          ? input.phoneNumber
          : undefined;

      const profileData = {
        displayName: input.displayName,
        email: cleanEmail,
        phoneNumber: cleanPhoneNumber,
        occupation: input.occupation,
        occupationDescription: input.occupationDescription,
        accountPurposes: input.accountPurposes || [],
        accountType: input.accountType || "INDIVIDUAL",
        selectedPlan: input.selectedPlan || "free",
        planDuration: input.planDuration || "MONTHLY",
        isEmailVerified: cleanEmail ? true : false,
        isPhoneVerified: cleanPhoneNumber ? true : false,
        // Update tokens based on planType
        availableTokens: this.getTokensForPlan(input.selectedPlan || "free"),
      };

      const options = { new: true };
      const user = await this.userRepo.updateByFirebaseUid(
        input.firebaseUid,
        profileData,
        options
      );

      if (!user) {
        throw new UserInputError("User not found");
      }

      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      logger.info(`Profile completed for user: ${user._id}`);

      return {
        user: userWithoutPassword,
        isProfileComplete: true,
      };
    } catch (error) {
      logger.error(`Profile completion error: ${error.message}`);
      throw error;
    }
  }

  async register(input) {
    logger.debug(`Input Provided: ${JSON.stringify(input)}`);
    try {
      // Check if user exists by firebaseUid first
      if (input.firebaseUid) {
        // Convert empty strings to undefined to avoid duplicate key errors
        const cleanEmail =
          input.email && input.email.trim() !== "" ? input.email : undefined;
        const cleanPhoneNumber =
          input.phoneNumber && input.phoneNumber.trim() !== ""
            ? input.phoneNumber
            : undefined;

        const update = {
          displayName: input.fullName,
          email: cleanEmail,
          phoneNumber: cleanPhoneNumber,
          occupation: input.occupation,
          occupationDescription: input.occupationDescription,
          accountPurposes: input.accountPurposes || [],
          accountType: input.accountType || "INDIVIDUAL",
          selectedPlan: input.selectedPlan || "free",
          planDuration: input.planDuration || "MONTHLY",
          firebaseUid: input.firebaseUid,
          isEmailVerified: cleanEmail ? true : false,
          // Update tokens based on plan
          availableTokens: this.getTokensForPlan(input.selectedPlan || "free"),
        };
        const options = { new: true, upsert: true, setDefaultsOnInsert: true };
        const user = await this.userRepo.updateByFirebaseUid(
          input.firebaseUid,
          update,
          options
        );
        // After user creation/update, perform Firebase login (token exchange style)
        // Generate JWT and return user info, requiresOTP: false
        const token = this.generateToken(user);
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        return {
          user: userWithoutPassword,
          token,
          requiresOTP: false,
          isProfileComplete: true,
        };
      }

      // Check if user exists
      if (input.email && input.email.trim() !== "") {
        const existingUserByEmail = await this.userRepo.findByEmail(
          input.email
        );
        if (existingUserByEmail) {
          throw new UserInputError("Email already in use");
        }
      }

      if (input.phoneNumber && input.phoneNumber.trim() !== "") {
        const existingUserByPhone = await this.userRepo.findByPhoneNumber(
          input.phoneNumber
        );

        if (existingUserByPhone) {
          throw new UserInputError("Phone number already in use");
        }
      }

      // Note: Database schema validation ensures at least one of email or phoneNumber is provided

      // Create Firebase user if Firebase is initialized
      let firebaseUid = undefined; // Use undefined instead of null to avoid duplicate key error

      if (firebaseService.isInitialized()) {
        try {
          const firebaseUser = await firebaseService.createUser({
            email: input.email,
            phoneNumber: input.phoneNumber,
            password: input.password,
            displayName: input.fullName,
          });
          firebaseUid = firebaseUser.uid;
        } catch (firebaseError) {
          logger.error(
            `Firebase user creation failed: ${firebaseError.message}`
          );
          // Continue with local user creation
        }
      }

      // Create user
      const user = await this.userRepo.create({
        displayName: input.fullName,
        email: input.email,
        phoneNumber: input.phoneNumber,
        password: input.password, // Let the pre-save middleware hash it
        firebaseUid: firebaseUid,
        occupation: input.occupation,
        occupationDescription: input.occupationDescription,
        accountPurposes: input.accountPurposes || [],
        accountType: input.accountType || "INDIVIDUAL",
        selectedPlan: input.selectedPlan || "free",
        planDuration: input.planDuration || "MONTHLY",
      });

      logger.info(`New user registered: ${user._id}`);

      // Generate OTP for verification
      await this.generateOTP(user._id, input.email, input.phoneNumber);

      // Return user without password
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      logger.debug(
        `Checking user during registration: ${JSON.stringify(user)}`
      );

      return {
        user: userWithoutPassword,
        requiresOTP: true,
      };
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  async login(input) {
    try {
      // Validate input - check for actual values, not just presence
      const hasEmail = input.email && input.email.trim();
      const hasPhone = input.phoneNumber && input.phoneNumber.trim();

      if (!hasEmail && !hasPhone) {
        throw new UserInputError("Either email or phone number is required");
      }

      if (!input.password || !input.password.trim()) {
        throw new UserInputError("Password is required");
      }

      logger.debug(
        `User Input: ${JSON.stringify({
          email: input.email || null,
          phoneNumber: input.phoneNumber || null,
          hasPassword: !!input.password,
          password: input.password || null,
        })}`
      );

      // Find user by email or phone with password
      const user = await this.userRepo.findByEmailOrPhoneWithPassword({
        email: hasEmail ? input.email.trim() : null,
        phoneNumber: hasPhone ? input.phoneNumber.trim() : null,
      });

      if (!user) {
        logger.debug("User not found with provided credentials");
        throw new AuthenticationError("Invalid credentials");
      }

      logger.debug(`Found user: ${user._id}`);

      // Verify that user has a password set
      if (!user.password) {
        logger.debug("User exists but has no password set");
        throw new AuthenticationError("Invalid credentials");
      }
      logger.debug(`Input password: ${input.password}`);
      logger.debug(`User password: ${user.password}`);
      // Check password
      const isPasswordValid = await bcrypt.compare(
        input.password.trim(),
        user.password
      );

      if (!isPasswordValid) {
        logger.debug("Password validation failed");
        throw new AuthenticationError("Invalid credentials");
      }

      // Update last login
      await this.userRepo.updateById(user._id, { lastLoginAt: new Date() });

      // Generate OTP
      await this.generateOTP(user._id, user.email, user.phoneNumber);

      // Return user without password
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      logger.info(`User logged in successfully: ${user._id}`);

      return {
        user: userWithoutPassword,
        requiresOTP: true,
      };
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      if (error.name === "ValidationError" || error.name === "CastError") {
        throw new UserInputError("Invalid input format");
      }
      throw error;
    }
  }

  async generateOTP(userId, email, phoneNumber) {
    try {
      const otpCode = this.useMock
        ? "1234"
        : Math.floor(1000 + Math.random() * 9000).toString();

      await this.otpRepo.deleteMany({ userId });

      const otp = await this.otpRepo.create({
        userId,
        email,
        phoneNumber,
        otpCode: await bcrypt.hash(otpCode, 10),
      });

      if (!this.useMock) {
        if (email)
          logger.info(`OTP email sent to ${email} with code ${otpCode}`);
        if (phoneNumber)
          logger.info(`OTP SMS sent to ${phoneNumber} with code ${otpCode}`);
      } else {
        logger.debug(`Mock OTP for user ${userId}: ${otpCode}`);
      }

      return otpCode;
    } catch (error) {
      logger.error(`OTP generation error: ${error.message}`);
      throw error;
    }
  }

  async verifyOTP(input) {
    try {
      const { email, phoneNumber, otpCode } = input;

      if (!email && !phoneNumber) {
        throw new UserInputError("Either email or phone number is required");
      }

      // Fetch OTP record
      const otpRecord = await this.otpRepo.findByContact({
        email,
        phoneNumber,
      });
      if (!otpRecord) {
        throw new UserInputError("No OTP found. Please request a new one.");
      }

      // Validate expiry
      if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
        await this.otpRepo.deleteById(otpRecord._id);
        throw new UserInputError("OTP has expired. Please request a new one.");
      }

      // Validate attempt limits
      if (otpRecord.attempts >= 3) {
        await this.otpRepo.deleteById(otpRecord._id);
        throw new UserInputError(
          "Too many failed attempts. Please request a new OTP."
        );
      }

      // Compare OTP
      const isOtpValid = this.useMock
        ? otpCode === "1234"
        : await bcrypt.compare(otpCode, otpRecord.otpCode);

      if (!isOtpValid) {
        await this.otpRepo.updateAttempts(otpRecord._id, 1);
        throw new UserInputError("Invalid OTP");
      }

      await this.otpRepo.verifyOTP(otpRecord._id);

      // Fetch user & update verification status
      const user = await this.userRepo.findById(otpRecord.userId);
      if (!user) throw new Error("User not found");

      const updatedFields = {};
      if (email) updatedFields.isEmailVerified = true;
      if (phoneNumber) updatedFields.isPhoneVerified = true;

      const updatedUser = await this.userRepo.updateById(
        user._id,
        updatedFields
      );

      const token = this.generateToken(updatedUser);
      logger.info(`User ${updatedUser._id} verified with OTP`);

      return {
        success: true,
        message: "OTP verified successfully",
        token,
        user: {
          id: updatedUser._id.toString(),
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          displayName: updatedUser.displayName,
          planType: updatedUser.planType,
          availableTokens: updatedUser.availableTokens,
          totalTokensConsumed: updatedUser.totalTokensConsumed,
          isActive: updatedUser.isActive,
          lastLoginAt: updatedUser.lastLoginAt,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
          occupation: updatedUser.occupation,
          occupationDescription: updatedUser.occupationDescription,
          accountPurposes: updatedUser.accountPurposes,
          accountType: updatedUser.accountType,
          selectedPlan: updatedUser.selectedPlan,
          planDuration: updatedUser.planDuration,
        },
      };
    } catch (error) {
      logger.error(`OTP verification error: ${error.message}`);
      throw error;
    }
  }

  async resendOTP(email, phoneNumber, method) {
    try {
      if (!email && !phoneNumber) {
        throw new UserInputError("Either email or phone number is required");
      }

      // Find user
      let user;
      if (email) {
        user = await this.userRepo.findByEmail(email);
      } else {
        user = await this.userRepo.findByPhoneNumber(phoneNumber);
      }

      if (!user) {
        throw new UserInputError("User not found");
      }

      // Generate new OTP
      if (method === "EMAIL" && email) {
        await this.generateOTP(user._id, email, null);
      } else if (method === "SMS" && phoneNumber) {
        await this.generateOTP(user._id, null, phoneNumber);
      } else {
        throw new UserInputError("Invalid OTP method");
      }

      logger.info(`OTP resent to user ${user._id}`);
      return true;
    } catch (error) {
      logger.error(`Resend OTP error: ${error.message}`);
      throw error;
    }
  }

  async exchangeFirebaseToken(token) {
    try {
      if (!firebaseService.isInitialized()) {
        throw new AuthenticationError(
          "Firebase authentication is not configured"
        );
      }

      // Verify the Firebase token
      const decodedToken = await firebaseService.verifyIdToken(token);
      if (!decodedToken?.uid) {
        throw new AuthenticationError("Invalid Firebase token");
      }

      logger.info(`Firebase token verified for user: ${decodedToken.uid}`);

      // Check if user exists in our database
      let user = await this.userRepo.findByFirebaseUid(decodedToken.uid);

      if (!user) {
        // Create a new user in our database if they don't exist
        logger.info(`Creating new user for Firebase user: ${decodedToken.uid}`);

        const userEmail = decodedToken.email || null;
        const userPhone = decodedToken.phone_number || null;
        const displayName =
          decodedToken.name ||
          decodedToken.display_name ||
          (userEmail ? userEmail.split("@")[0] : "User");

        user = await this.userRepo.create({
          firebaseUid: decodedToken.uid,
          email: userEmail,
          phoneNumber: userPhone,
          displayName,
          planType: "free",
          paymentProvider: "none",
          availableTokens: 100,
          totalTokensConsumed: 0,
          isActive: true,
          lastLoginAt: new Date(),
        });
      } else {
        // Update last login if user already exists
        await this.userRepo.updateById(user._id, { lastLoginAt: new Date() });
      }

      // Generate a custom JWT token
      const customToken = this.generateToken(user);

      logger.info(`Firebase user authenticated: ${user._id}`);

      // Return user data and token
      return {
        user: {
          id: user._id.toString(),
          firebaseUid: user.firebaseUid,
          email: user.email,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName,
          planType: user.planType,
          paymentProvider: user.paymentProvider,
          availableTokens: user.availableTokens,
          totalTokensConsumed: user.totalTokensConsumed,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          occupation: user.occupation,
          occupationDescription: user.occupationDescription,
          accountPurposes: user.accountPurposes,
          accountType: user.accountType,
          selectedPlan: user.selectedPlan,
          planDuration: user.planDuration,
        },
        token: customToken,
        requiresOTP: false, // No OTP needed for Firebase authentication
      };
    } catch (error) {
      logger.error(`Firebase token exchange error: ${error.message}`);
      throw new AuthenticationError(
        `Firebase authentication failed: ${error.message}`
      );
    }
  }

  async logout() {
    return true; // Stateless logout
  }

  async requestPasswordReset(email, phoneNumber) {
    try {
      if (
        (!email || email.trim() === "") &&
        (!phoneNumber || phoneNumber.trim() === "")
      ) {
        throw new UserInputError("Either email or phone number is required");
      }

      // Find user by email or phone number
      const query = {};
      if (email && email.trim() !== "") {
        query.email = email;
      } else if (phoneNumber && phoneNumber.trim() !== "") {
        query.phoneNumber = phoneNumber;
      }

      const user = await this.userRepo.findByEmailOrPhoneWithPassword(query);
      if (!user) {
        throw new UserInputError(
          "No user found with the provided contact information"
        );
      }

      // Generate OTP for password reset
      await this.generateOTP(user._id, user.email, user.phoneNumber);

      logger.info(`Password reset OTP sent to: ${email || phoneNumber}`);
      return true;
    } catch (error) {
      logger.error(`Request password reset error: ${error.message}`);
      throw error;
    }
  }

  async resetPassword(email, phoneNumber, otpCode, newPassword) {
    logger.debug(`Found new Password as: ${newPassword}`);
    try {
      if (
        (!email || email.trim() === "") &&
        (!phoneNumber || phoneNumber.trim() === "")
      ) {
        throw new UserInputError("Either email or phone number is required");
      }
      if (!otpCode || otpCode.trim() === "") {
        throw new UserInputError("OTP code is required");
      }
      if (!newPassword || newPassword.length < 6) {
        throw new UserInputError("New password must be at least 6 characters");
      }

      // Find OTP record by email or phone number
      const query = {};
      if (email && email.trim() !== "") {
        query.email = email;
      } else if (phoneNumber && phoneNumber.trim() !== "") {
        query.phoneNumber = phoneNumber;
      }

      const otpRecord = await this.otpRepo.findByContact(query);
      if (!otpRecord) {
        throw new UserInputError("No OTP found. Please request a new one.");
      }

      // Check if OTP is expired
      if (otpRecord.expiresAt < new Date()) {
        await this.otpRepo.deleteById(otpRecord._id);
        throw new UserInputError("OTP has expired. Please request a new one.");
      }

      // Check attempts
      if (otpRecord.attempts >= 3) {
        await this.otpRepo.deleteById(otpRecord._id);
        throw new UserInputError(
          "Too many failed attempts. Please request a new OTP."
        );
      }

      // Verify OTP
      const isOtpValid = this.useMock
        ? otpCode === "1234"
        : await bcrypt.compare(otpCode, otpRecord.otpCode);

      if (!isOtpValid) {
        await this.otpRepo.updateAttempts(otpRecord._id, 1);
        throw new UserInputError("Invalid OTP");
      }

      await this.otpRepo.verifyOTP(otpRecord._id);

      // Update user's password
      const user = await this.userRepo.findByIdWithPassword(otpRecord.userId);
      if (!user) {
        throw new Error("User not found");
      }
      logger.debug(`Current password hash: ${user.password || 'not set'}`);
      user.password = newPassword; // Let the pre-save middleware hash it
      await user.save();

      logger.info(`Password reset for user: ${user._id}`);
      return true;
    } catch (error) {
      logger.error(`Reset password error: ${error.message}`);
      throw error;
    }
  }

  async deductTokens(contextUser, tokensUsed) {
    try {
      if (!contextUser) {
        throw new AuthenticationError("Authentication required");
      }

      let user;
      if (contextUser.uid) {
        user = await this.userRepo.findByFirebaseUid(contextUser.uid);
      } else if (contextUser.id) {
        user = await this.userRepo.findById(contextUser.id);
      } else {
        throw new Error("No valid user identifier found");
      }

      if (!user) {
        throw new Error("User not found");
      }

      if (user.availableTokens < tokensUsed) {
        throw new UserInputError("Insufficient tokens available");
      }

      // Update user's token balance
      const updatedUser = await this.userRepo.updateById(user._id, {
        availableTokens: user.availableTokens - tokensUsed,
        totalTokensConsumed: user.totalTokensConsumed + tokensUsed
      });

      logger.info(`Deducted ${tokensUsed} tokens from user ${user._id}`);

      return {
        success: true,
        message: `Successfully deducted ${tokensUsed} tokens`,
        user: {
          id: updatedUser._id.toString(),
          firebaseUid: updatedUser.firebaseUid,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          displayName: updatedUser.displayName,
          avatar: updatedUser.avatar,
          
          // Account Status
          isActive: updatedUser.isActive,
          isEmailVerified: updatedUser.isEmailVerified,
          isPhoneVerified: updatedUser.isPhoneVerified,
          
          // Plan & Subscription Information
          planType: updatedUser.planType,
          selectedPlan: updatedUser.selectedPlan,
          planDuration: updatedUser.planDuration,
          paymentProvider: updatedUser.paymentProvider,
          
          // Token Management
          availableTokens: updatedUser.availableTokens,
          totalTokensConsumed: updatedUser.totalTokensConsumed,
          
          // Profile & Occupation
          occupation: updatedUser.occupation,
          occupationDescription: updatedUser.occupationDescription,
          accountPurposes: updatedUser.accountPurposes,
          accountType: updatedUser.accountType,
          
          // Billing Information
          billingInfo: updatedUser.billingInfo,
          
          // Security & Login
          lastLoginAt: updatedUser.lastLoginAt,
          loginAttempts: updatedUser.loginAttempts,
          isLocked: updatedUser.isLocked,
          
          // Timestamps
          emailVerifiedAt: updatedUser.emailVerifiedAt,
          phoneVerifiedAt: updatedUser.phoneVerifiedAt,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
          
          // Metadata
          signupSource: updatedUser.signupSource,
          referrer: updatedUser.referrer,
        }
      };
    } catch (error) {
      logger.error(`Token deduction error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AuthService(); 