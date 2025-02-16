import { Request, Response } from "express";
import { authService, userService, emailService } from "../services";
import { AppError } from "@/middlewares";
import { constants, Logger } from "../config";
import { db } from "@/db/client";
import { roles } from "@/db/schema";
import { eq } from "drizzle-orm";

const logger = new Logger("AuthController");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirm_password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               confirm_password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if email already exists
    try {
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        throw new AppError("Email already in use", 400);
      }
    } catch (error) {
      // If error is "user not found", that's what we want
      if (!(error instanceof AppError && error.statusCode === 404)) {
        throw error;
      }
    }

    // Get default 'applicant' role from database
    let defaultRole;
    try {
      defaultRole = await db.query.roles.findFirst({
        where: eq(roles.name, "applicant"),
      });

      if (!defaultRole) {
        // If applicant role doesn't exist, get the first available role
        const allRoles = await db.select().from(roles).limit(1);
        if (allRoles.length > 0) {
          defaultRole = allRoles[0];
          logger.warn(
            `Could not find applicant role, using role: ${defaultRole.name}`,
          );
        } else {
          // If no roles exist, use a fallback ID
          defaultRole = { id: 1 };
          logger.warn("No roles found in database, using default role ID: 1");
        }
      }
    } catch (error) {
      // Fallback to a default role ID if role lookup fails
      defaultRole = { id: 1 };
      logger.error("Error fetching roles", error);
      logger.warn("Error fetching roles, using default role ID: 1");
    }

    // Create user with applicant base role by default
    const user = await userService.createUser({
      email,
      password,
      name,
      role_id: defaultRole.id,
      sendVerificationEmail: true,
    });

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(email, name);
    } catch (emailError) {
      logger.error("Failed to send welcome email", emailError);
      // Don't block registration if email fails
    }

    res.status(201).json({
      message: constants.SUCCESS_MESSAGES.USER_CREATED,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_verified: user.email_verified,
      },
    });
  } catch (error) {
    logger.error("Registration error", error);
    handleErrorResponse(error, res, "Registration Error");
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               remember_me:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, remember_me = false } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    // Get user by email
    let user;
    try {
      user = await userService.getUserByEmail(email);
    } catch (error) {
      throw new AppError(constants.ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Verify password
    const passwordValid = await authService.verifyPassword(
      password,
      user.password_hash,
    );
    if (!passwordValid) {
      // Optionally implement login attempt tracking
      // await userService.incrementLoginAttempts(user.id);
      throw new AppError(constants.ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Check account status
    if (!user.is_active) {
      throw new AppError(
        constants.ERROR_MESSAGES.ACCOUNT_INACTIVE || "Account is inactive",
        401,
      );
    }

    // Create session and tokens using JWT
    const { accessToken, refreshToken } = await authService.createSession(
      user.id,
      req.ip || "unknown",
      req.headers["user-agent"] || "unknown",
    );

    // Set cookies
    const cookieOptions = {
      ...constants.COOKIE_OPTIONS,
      maxAge: remember_me ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    };

    res.cookie(constants.AUTH_COOKIE_NAME, accessToken, cookieOptions);
    res.cookie(constants.REFRESH_COOKIE_NAME, refreshToken, cookieOptions);

    // Return success with user info and token
    res.status(200).json({
      message: constants.SUCCESS_MESSAGES.LOGIN_SUCCESS,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id,
        email_verified: user.email_verified,
        avatar_url: user.avatar_url,
      },
      token: accessToken,
    });
  } catch (error) {
    logger.error("Login error", error);
    handleErrorResponse(error, res, "Authentication Error");
  }
};

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get refresh token from cookie or body
    const refreshToken =
      req.cookies?.[constants.REFRESH_COOKIE_NAME] || req.body.refresh_token;

    if (!refreshToken) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Refresh token is required",
      });
      return;
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = await authService.verifyToken(refreshToken, true); // true indicates refresh token

      // Check if token type is refresh
      if (decoded.type !== constants.TOKEN_TYPES.REFRESH) {
        throw new Error("Invalid token type");
      }
    } catch (error) {
      // Clear cookies on invalid token
      res.clearCookie(constants.AUTH_COOKIE_NAME, constants.COOKIE_OPTIONS);
      res.clearCookie(constants.REFRESH_COOKIE_NAME, constants.COOKIE_OPTIONS);

      res.status(401).json({
        error: "Unauthorized",
        message: constants.ERROR_MESSAGES.INVALID_TOKEN,
      });
      return;
    }

    // Get user
    let user;
    try {
      user = await userService.getUserById(Number(decoded.id));
    } catch (error) {
      throw new AppError("User not found", 404);
    }

    // Verify account status
    if (!user.is_active) {
      throw new AppError(
        constants.ERROR_MESSAGES.ACCOUNT_INACTIVE || "Account is inactive",
        401,
      );
    }

    // Create new session and tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await authService.createSession(
        user.id,
        req.ip || "unknown",
        req.headers["user-agent"] || "unknown",
      );

    // Set cookies
    res.cookie(
      constants.AUTH_COOKIE_NAME,
      accessToken,
      constants.COOKIE_OPTIONS,
    );
    res.cookie(
      constants.REFRESH_COOKIE_NAME,
      newRefreshToken,
      constants.COOKIE_OPTIONS,
    );

    res.status(200).json({
      message: "Token refreshed successfully",
      token: accessToken,
    });
  } catch (error) {
    logger.error("Token refresh error", error);
    handleErrorResponse(error, res, "Token Refresh Error");
  }
};

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User info retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        error: "Unauthorized",
        message: constants.ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    // Get user details
    const user = await userService.getUserById(Number(req.user.id));

    // Update session activity timestamp if we have session ID
    if ((req as any).sessionId) {
      await authService.updateSessionActivity((req as any).sessionId);
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified,
      },
    });
  } catch (error) {
    logger.error("Get current user error", error);
    handleErrorResponse(error, res, "Authentication Error");
  }
};

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    // Get user by email
    let user;
    try {
      user = await userService.getUserByEmail(email);
    } catch (error) {
      // We return success even if the email is not found for security reasons
      res.status(200).json({
        message: constants.SUCCESS_MESSAGES.PASSWORD_RESET_SENT,
      });
      return;
    }

    // Check if user account is active
    if (!user.is_active) {
      // Still return success for security reasons
      res.status(200).json({
        message: constants.SUCCESS_MESSAGES.PASSWORD_RESET_SENT,
      });
      return;
    }

    // Send password reset email
    await authService.sendPasswordReset(
      user.id,
      user.email,
      req.ip || "unknown",
    );

    res.status(200).json({
      message: constants.SUCCESS_MESSAGES.PASSWORD_RESET_SENT,
    });
  } catch (error) {
    logger.error("Forgot password error", error);
    handleErrorResponse(error, res, "Password Reset Error");
  }
};

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - confirm_password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *               confirm_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token, password, confirm_password } = req.body;

    if (!token || !password) {
      throw new AppError("Token and password are required", 400);
    }

    if (password !== confirm_password) {
      throw new AppError("Passwords do not match", 400);
    }

    // Verify token and get user ID
    let decoded;
    try {
      decoded = await authService.verifyToken(token);
    } catch (error) {
      throw new AppError(constants.ERROR_MESSAGES.INVALID_TOKEN, 400);
    }

    // Reset the password
    await authService.resetPassword(token, Number(decoded.id), password);

    res.status(200).json({
      message: constants.SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
    });
  } catch (error) {
    logger.error("Password reset error", error);
    handleErrorResponse(error, res, "Password Reset Error");
  }
};

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        error: "Unauthorized",
        message: constants.ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    // Get token from cookie or header
    const token =
      req.cookies?.[constants.AUTH_COOKIE_NAME] ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.substring(7)
        : null);

    if (token) {
      // Invalidate the session
      await authService.invalidateSession(token);
    }

    // Clear cookies
    res.clearCookie(constants.AUTH_COOKIE_NAME);
    res.clearCookie(constants.REFRESH_COOKIE_NAME);

    res.status(200).json({
      message: constants.SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    });
  } catch (error) {
    logger.error("Logout error", error);
    handleErrorResponse(error, res, "Logout Error");
  }
};

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify user email with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new AppError("Token is required", 400);
    }

    // Decode token to get user ID
    let decoded;
    try {
      decoded = await authService.verifyToken(token);
    } catch (error) {
      throw new AppError(constants.ERROR_MESSAGES.INVALID_TOKEN, 400);
    }

    // Verify the email
    await authService.verifyEmailToken(token, Number(decoded.id));

    res.status(200).json({
      message: constants.SUCCESS_MESSAGES.EMAIL_VERIFIED,
    });
  } catch (error) {
    logger.error("Email verification error", error);
    handleErrorResponse(error, res, "Verification Error");
  }
};

/**
 * Helper function to handle error responses consistently
 * @param {unknown} error - The error object
 * @param {Response} res - Express response object
 * @param {string} errorType - Type of error for the response
 */
function handleErrorResponse(
  error: unknown,
  res: Response,
  errorType: string,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: errorType,
      message: error.message,
    });
  } else {
    res.status(500).json({
      error: errorType,
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
}
