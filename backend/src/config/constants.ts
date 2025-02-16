// Application constants

export const AUTH_COOKIE_NAME = "ganzafrica_auth";
export const REFRESH_COOKIE_NAME = "ganzafrica_refresh";
export const CSRF_COOKIE_NAME = "ganzafrica_csrf";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  FELLOW: "fellow",
  MENTOR: "mentor",
  STAFF: "staff",
};

export const BASE_ROLES = {
  APPLICANT: "applicant",
  FELLOW: "fellow",
  EMPLOYEE: "employee",
  ALUMNI: "alumni",
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to access this resource",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Validation error",
  INTERNAL_SERVER_ERROR: "Internal server error",
  INVALID_CREDENTIALS: "Invalid credentials",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  EMAIL_NOT_VERIFIED: "Email not verified",
  ACCOUNT_LOCKED: "Account locked",
  INVALID_TOKEN: "Invalid token",
  PASSWORD_RESET_EXPIRED: "Password reset token expired",
  TOO_MANY_REQUESTS: "Too many requests, please try again later",
  FORBIDDEN: "You do not have permission to perform this action",
  USER_NOT_FOUND: "User not found",
  INVALID_PASSWORD: "Invalid password",
  PASSWORD_MISMATCH: "Passwords do not match",
  INVALID_EMAIL: "Invalid email address",
  INVALID_PHONE: "Invalid phone number",
  INVALID_VERIFICATION_CODE: "Invalid verification code",
  INVALID_TWO_FACTOR_CODE: "Invalid two-factor authentication code",
  USER_ALREADY_EXISTS: "User already exists",
  USER_NOT_ACTIVE: "User is not active",
  USER_NOT_VERIFIED: "User is not verified",
  USER_ALREADY_VERIFIED: "User is already verified",
  ACCOUNT_INACTIVE: "Account is inactive",
  ACCOUNT_SUSPENDED: "Account is suspended",
  BAD_REQUEST: "Bad request",
  EMAIL_NOT_FOUND: "Email not found",
};

export const SUCCESS_MESSAGES = {
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  EMAIL_VERIFICATION_SENT: "Email verification sent",
  EMAIL_VERIFIED: "Email verified successfully",
  PASSWORD_RESET_SENT: "Password reset email sent",
  PASSWORD_RESET_SUCCESS: "Password reset successful",
};

export const EMAIL_TEMPLATES = {
  VERIFICATION: "email-verification",
  PASSWORD_RESET: "password-reset",
  WELCOME: "welcome",
};

export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
  VERIFICATION: "verification",
  PASSWORD_RESET: "password-reset",
  TWO_FACTOR: "two-factor",
};

export const TOKEN_EXPIRY = {
  ACCESS: "15m",
  REFRESH: "7d",
  VERIFICATION: "24h",
  PASSWORD_RESET: "1h",
  TWO_FACTOR: "10m",
};

export const MAX_FAILED_LOGIN_ATTEMPTS = 5;
export const FAILED_LOGIN_TIMEOUT_MINUTES = 15;
