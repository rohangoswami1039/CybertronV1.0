const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        // Allow empty strings and null values
        return (
          v === null ||
          v === undefined ||
          v === "" ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        );
      },
      message: "Please provide a valid email address",
    },
  },
  
  password: {
    type: String,
    select: false, // Don't include password in query results by default
  },
  
  // Firebase Integration
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  
  // Profile Information
  displayName: {
    type: String,
    trim: true,
  },

  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    validate: {
      validator: function (v) {
        // Allow empty strings and null values
        return (
          v === null ||
          v === undefined ||
          v === "" ||
          /^\+?[\d\s\-\(\)]+$/.test(v)
        );
      },
      message: "Please provide a valid phone number",
    },
  },
  
  avatar: {
    type: String,
    default: null
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  // Subscription & Plan Information (using consistent naming)
  planType: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  
  selectedPlan: {
    type: String,
    default: 'free'
  },
  
  planDuration: {
    type: String,
    enum: ['MONTHLY', 'YEARLY'],
    default: 'MONTHLY'
  },
  
  paymentProvider: {
    type: String,
    enum: ['none', 'stripe', 'razorpay'],
    default: 'none'
  },
  
  // Token Management (using consistent naming)
  availableTokens: {
    type: Number,
    default: 1000,
    min: [0, 'Available tokens cannot be negative']
  },
  
  totalTokensConsumed: {
    type: Number,
    default: 0,
    min: [0, 'Total tokens consumed cannot be negative']
  },
  
  // User Profile & Occupation (from old model)
  occupation: {
    type: String,
    trim: true
  },
  
  occupationDescription: {
    type: String,
    trim: true
  },
  
  accountPurposes: {
    type: [String],
    default: []
  },
  
  accountType: {
    type: String,
    enum: ['AGENCY', 'COMPANY', 'INDIVIDUAL', 'OTHER'],
    default: 'INDIVIDUAL'
  },
  
  // Billing Information (from new model)
  billingInfo: {
    name: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    taxId: String
  },
  
  // Security & Login Information
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  
  loginAttempts: {
    type: Number,
    default: 0
  },
  
  lockUntil: {
    type: Date,
    default: null
  },
  
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Timestamps
  emailVerifiedAt: Date,
  phoneVerifiedAt: Date,
  
  // Metadata (from new model)
  signupSource: {
    type: String,
    enum: ['email', 'google', 'facebook', 'apple', 'firebase'],
    default: 'email'
  },
  
  referrer: {
    type: String,
    trim: true
  },
  
  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.displayName || '';
});

// Virtual for isLocked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Indexes
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phoneNumber: 1 }, { unique: true, sparse: true });
userSchema.index({ firebaseUid: 1 }, { unique: true, sparse: true });
userSchema.index({ planType: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware
userSchema.pre('save', async function(next) {
  try {
    // Hash password if modified
    if (this.isModified('password') && this.password) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
    
    // Set default tokens based on planType
    if (this.isModified('planType')) {
      const tokenMap = {
        free: 1000,
        pro: 10000,
        enterprise: 100000
      };
      this.availableTokens = tokenMap[this.planType] || 1000;
    }
    
    // If firebaseUid is null, set it to undefined to avoid duplicate key error
    if (this.firebaseUid === null) {
      this.firebaseUid = undefined;
    }
    
    // If email is null or empty string, set it to undefined to avoid duplicate key error
    if (this.email === null || this.email === "") {
      this.email = undefined;
    }
    
    // If phoneNumber is null or empty string, set it to undefined to avoid duplicate key error
    if (this.phoneNumber === null || this.phoneNumber === "") {
      this.phoneNumber = undefined;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-validate hook to ensure at least one contact method is provided
userSchema.pre('validate', function(next) {
  // Check if at least one of email or phoneNumber is provided (and not empty)
  const hasEmail = this.email && this.email.trim() !== "";
  const hasPhone = this.phoneNumber && this.phoneNumber.trim() !== "";

  if (!hasEmail && !hasPhone) {
    const error = new Error("Either email or phone number is required");
    error.name = "ValidationError";
    return next(error);
  }

  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLoginAt: new Date() }
  });
};

userSchema.methods.hasEnoughTokens = function(requiredTokens) {
  return this.availableTokens >= requiredTokens;
};

userSchema.methods.consumeTokens = function(amount) {
  if (this.availableTokens < amount) {
    throw new Error('Insufficient tokens');
  }
  this.availableTokens -= amount;
  this.totalTokensConsumed += amount;
  return this.save();
};

userSchema.methods.addTokens = function(amount) {
  this.availableTokens += amount;
  return this.save();
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByFirebaseUid = function(firebaseUid) {
  return this.findOne({ firebaseUid });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
        verifiedUsers: { $sum: { $cond: ['$isEmailVerified', 1, 0] } },
        totalAvailableTokens: { $sum: '$availableTokens' },
        totalTokensConsumed: { $sum: '$totalTokensConsumed' },
        avgAvailableTokens: { $avg: '$availableTokens' }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    totalAvailableTokens: 0,
    totalTokensConsumed: 0,
    avgAvailableTokens: 0
  };
};

// Query helpers
userSchema.query.byPlanType = function(planType) {
  return this.where({ planType });
};

userSchema.query.active = function() {
  return this.where({ isActive: true });
};

userSchema.query.verified = function() {
  return this.where({ isEmailVerified: true });
};

const User = mongoose.model('User', userSchema);

// Function to recreate indexes with proper sparse configuration
const recreateIndexes = async () => {
  try {
    // Drop existing indexes
    await User.collection.dropIndexes();
    console.log("Dropped existing indexes");

    // Create new indexes with proper sparse configuration
    await User.collection.createIndex(
      { firebaseUid: 1 },
      { unique: true, sparse: true }
    );
    await User.collection.createIndex(
      { email: 1 },
      { unique: true, sparse: true }
    );
    await User.collection.createIndex(
      { phoneNumber: 1 },
      { unique: true, sparse: true }
    );

    console.log("Recreated indexes with sparse configuration");
  } catch (error) {
    console.error("Error recreating indexes:", error);
  }
};

// Export the function for use in initialization
module.exports = { User, recreateIndexes }; 