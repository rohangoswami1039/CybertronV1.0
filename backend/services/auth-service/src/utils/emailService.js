const nodemailer = require('nodemailer');
const { logger } = require('../middleware/logger');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Cybertron AI Platform!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from Cybertron AI Platform. Please do not reply to this email.
        </p>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from Cybertron AI Platform. Please do not reply to this email.
        </p>
      </div>
    `
  }),

  otp: (data) => ({
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verification Code</h2>
        <p>Hi ${data.name},</p>
        <p>Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px;">${data.otp}</span>
          </div>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from Cybertron AI Platform. Please do not reply to this email.
        </p>
      </div>
    `
  }),

  welcome: (data) => ({
    subject: 'Welcome to Cybertron AI Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Cybertron AI Platform!</h2>
        <p>Hi ${data.name},</p>
        <p>Welcome to Cybertron AI Platform! Your account has been successfully created and verified.</p>
        <p>Here's what you can do with your account:</p>
        <ul>
          <li>Create and manage AI conversations</li>
          <li>Generate content with advanced AI models</li>
          <li>Manage your subscription and billing</li>
          <li>Access your usage statistics</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Get Started
          </a>
        </div>
        <p>If you have any questions, feel free to contact our support team.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from Cybertron AI Platform. Please do not reply to this email.
        </p>
      </div>
    `
  }),

  accountDeletion: (data) => ({
    subject: 'Account Deletion Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Account Deletion Confirmation</h2>
        <p>Hi ${data.name},</p>
        <p>We're sorry to see you go. Your account has been successfully deleted.</p>
        <p>All your data has been permanently removed from our systems.</p>
        <p>If you change your mind, you can always create a new account using the same email address.</p>
        <p>Thank you for using Cybertron AI Platform!</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from Cybertron AI Platform. Please do not reply to this email.
        </p>
      </div>
    `
  })
};

/**
 * Send email
 */
const sendEmail = async (emailData) => {
  try {
    const transporter = createTransporter();
    
    let subject, html;
    
    if (emailData.template && emailTemplates[emailData.template]) {
      const template = emailTemplates[emailData.template](emailData.data);
      subject = template.subject;
      html = template.html;
    } else {
      subject = emailData.subject;
      html = emailData.html;
    }

    const mailOptions = {
      from: `"Cybertron AI Platform" <${process.env.SMTP_FROM}>`,
      to: emailData.to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent: ${emailData.to} - Message ID: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    logger.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send bulk email
 */
const sendBulkEmail = async (emailList, template, data) => {
  try {
    const transporter = createTransporter();
    const results = [];

    for (const email of emailList) {
      try {
        const templateData = { ...data, name: email.name };
        const emailTemplate = emailTemplates[template](templateData);

        const mailOptions = {
          from: `"Cybertron AI Platform" <${process.env.SMTP_FROM}>`,
          to: email.address,
          subject: emailTemplate.subject,
          html: emailTemplate.html
        };

        const info = await transporter.sendMail(mailOptions);
        
        results.push({
          email: email.address,
          success: true,
          messageId: info.messageId
        });

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        results.push({
          email: email.address,
          success: false,
          error: error.message
        });
      }
    }

    logger.info(`Bulk email sent: ${results.length} emails`);
    
    return {
      success: true,
      results
    };
  } catch (error) {
    logger.error('Error sending bulk email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify email configuration
 */
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    
    logger.info('Email configuration verified successfully');
    return {
      success: true
    };
  } catch (error) {
    logger.error('Email configuration verification failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  verifyEmailConfig,
  emailTemplates
}; 