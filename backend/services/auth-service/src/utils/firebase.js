const admin = require("firebase-admin");
const { logger } = require("../middleware/logger");

/**
 * Centralized Firebase initialization and utility functions
 */
class FirebaseService {
  constructor() {
    this.initialized = false;
    this.initializeApp();
  }

  /**
   * Initialize Firebase Admin SDK if not already initialized
   */
  initializeApp() {
    try {
      // If Firebase is already initialized, use the existing instance
      if (admin.apps.length > 0) {
        this.initialized = true;
        logger.info("Firebase Admin SDK already initialized");
        return admin;
      }

      // Get Firebase credentials from environment variables
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (projectId && clientEmail && privateKey) {
        // Replace escaped newlines in private key
        const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

        // Initialize Firebase Admin SDK
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: projectId,
            clientEmail: clientEmail,
            privateKey: formattedPrivateKey,
          }),
        });

        this.initialized = true;
        logger.info("Firebase Admin SDK initialized successfully");
      } else {
        logger.warn(
          "Firebase credentials not provided (missing PROJECT_ID, CLIENT_EMAIL, or PRIVATE_KEY), authentication with Firebase will not work"
        );
      }
    } catch (error) {
      logger.error(`Error initializing Firebase Admin SDK: ${error.message}`);
    }

    return admin;
  }

  isInitialized() {
    return this.initialized || admin.apps.length > 0;
  }

  async createUser(userData) {
    if (!this.isInitialized()) {
      throw new Error("Firebase is not initialized");
    }

    try {
      const firebaseUser = await admin.auth().createUser({
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        displayName: userData.displayName,
      });

      logger.info(`Firebase user created: ${firebaseUser.uid}`);
      return firebaseUser;
    } catch (error) {
      logger.error(`Firebase user creation failed: ${error.message}`);
      throw error;
    }
  }

  async verifyIdToken(token) {
    if (!this.isInitialized()) {
      throw new Error("Firebase is not initialized");
    }

    return admin.auth().verifyIdToken(token);
  }
  getAdmin() {
    return admin;
  }
}

const firebaseService = new FirebaseService();
module.exports = { firebaseService }; 