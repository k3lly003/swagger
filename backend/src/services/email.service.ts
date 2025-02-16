import nodemailer from "nodemailer";
import { env, Logger } from "../config";
import { AppError } from "@/middlewares";

const logger = new Logger("EmailService");

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.EMAIL_FROM,
    pass: env.EMAIL_PASSWORD,
  },
});

// Verify SMTP connection on application startup
async function verifyEmailConnection() {
  try {
    await transporter.verify();
    logger.info("SMTP connection verified successfully");
    return true;
  } catch (error) {
    logger.error("SMTP connection failed", error);
    return false;
  }
}

// Generic function to send emails
async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Ganzafrica" <${env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error("Failed to send email", error);
    throw new AppError("Failed to send email", 500);
  }
}

// Send email verification email
export async function sendVerificationEmail(
  to: string,
  data: { token: string; expiresAt: Date },
) {
  const verificationUrl = `${env.WEBSITE_URL}/verify-email?token=${data.token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify your email address</h2>
      <p>Thank you for signing up for Ganzafrica. Please verify your email address by clicking the button below:</p>
      <div style="margin: 20px 0;">
        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
      </div>
      <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>This link will expire on ${data.expiresAt.toLocaleString()}.</p>
      <p>If you didn't sign up for Ganzafrica, you can safely ignore this email.</p>
      <hr>
      <p style="font-size: 12px; color: #666;">This is an automated email, please do not reply.</p>
    </div>
  `;

  return sendEmail(to, "Verify your Ganzafrica email address", html);
}

// Send password reset email
export async function sendPasswordResetEmail(
  to: string,
  data: { token: string; expiresAt: Date },
) {
  const resetUrl = `${env.WEBSITE_URL}/reset-password?token=${data.token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset your password</h2>
      <p>You have requested to reset your password for Ganzafrica. Please click the button below to set a new password:</p>
      <div style="margin: 20px 0;">
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
      </div>
      <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire on ${data.expiresAt.toLocaleString()}.</p>
      <p>If you didn't request a password reset, you can safely ignore this email and your password will remain unchanged.</p>
      <hr>
      <p style="font-size: 12px; color: #666;">This is an automated email, please do not reply.</p>
    </div>
  `;

  return sendEmail(to, "Reset your Ganzafrica password", html);
}

// Send welcome email
export async function sendWelcomeEmail(to: string, name: string) {
  const loginUrl = `${env.WEBSITE_URL}/login`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Ganzafrica!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for joining Ganzafrica. We're excited to have you on board!</p>
      <p>You can now log in to your account and start exploring:</p>
      <div style="margin: 20px 0;">
        <a href="${loginUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Log In to Your Account</a>
      </div>
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The Ganzafrica Team</p>
      <hr>
      <p style="font-size: 12px; color: #666;">This is an automated email, please do not reply.</p>
    </div>
  `;

  return sendEmail(to, "Welcome to Ganzafrica", html);
}

export { verifyEmailConnection };
