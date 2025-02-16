import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import {db, withDbTransaction} from "@/db/client";
import {password_reset_tokens, sessions, users, verification_tokens,} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {constants, env, Logger} from "../config";
import {sendPasswordResetEmail, } from "@/services/email.service";
import {AppError} from "@/middlewares";

const logger = new Logger("AuthService");

// Configure bcrypt options for password hashing
const SALT_ROUNDS = 10;

// Set secret key for JWT
const JWT_SECRET =
  env.JWT_SECRET || "your-default-jwt-secret-key-should-be-updated";
const JWT_REFRESH_SECRET =
  env.JWT_REFRESH_SECRET ||
  "your-default-jwt-refresh-secret-key-should-be-updated";

if (JWT_SECRET === "your-default-jwt-secret-key-should-be-updated") {
  logger.warn(
    "Using default JWT secret key. This is insecure for production environments.",
  );
}

// Define interfaces for token payloads and session data
interface TokenPayload {
  id: string;
  type: string;
  [key: string]: any;
}

interface SessionData {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}

/**
 * Hash a password using bcrypt
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    logger.error("Password hashing error", error);
    throw new Error("Failed to hash password");
  }
}

/**
 * Verify a password against its hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Stored hash to verify against
 * @returns {Promise<boolean>} - True if password matches hash
 * Verify a password against its hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Stored hash to verify against
 * @returns {Promise<boolean>} - True if password matches hash
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error("Password verification error", error);
    return false;
  }
}

/**
 * Create a JWT token
 * @param {TokenPayload} payload - Data to include in the token
 * @param {string} expiresIn - Token expiration time
 * @param {boolean} isRefresh - Whether this is a refresh token
 * @returns {Promise<string>} - Signed JWT token
 * Create a JWT token
 * @param {TokenPayload} payload - Data to include in the token
 * @param {string} expiresIn - Token expiration time
 * @param {boolean} isRefresh - Whether this is a refresh token
 * @returns {Promise<string>} - Signed JWT token
 */
export async function createToken(
  payload: TokenPayload,
  expiresIn: string = env.ACCESS_TOKEN_EXPIRY,
  isRefresh: boolean = false,
): Promise<string> {
  try {
    const expiresInMs = parseTimeToMs(expiresIn);
    const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_SECRET;

    return jwt.sign(
        {
          ...payload,
          jti: crypto.randomUUID(),
        },
        secret,
        {
          expiresIn: Math.floor(expiresInMs / 1000), // JWT uses seconds for expiration
        },
    );
  } catch (error) {
    logger.error("Token creation error", error);
    throw new AppError("Failed to create authentication token", 500);
  }
}

/**
 * Verify a JWT token
 * @param {string} token - Token to verify
 * @param {boolean} isRefresh - Whether this is a refresh token
 * @returns {Promise<TokenPayload>} - Decoded token payload
 * Verify a JWT token
 * @param {string} token - Token to verify
 * @param {boolean} isRefresh - Whether this is a refresh token
 * @returns {Promise<TokenPayload>} - Decoded token payload
 */
export async function verifyToken(
  token: string,
  isRefresh: boolean = false,
): Promise<TokenPayload> {
  try {
    const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_SECRET;
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    logger.error("Token verification error", error);

    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Token has expired", 401);
    }

    throw new AppError("Invalid or expired token", 401);
  }
}

/**
 * Create a new session for a user
 * @param {number} userId - User ID
 * @param {string} ipAddress - User's IP address
 * @param {string} userAgent - User's browser/device information
 * @returns {Promise<SessionData>} - Session details with tokens
 * Create a new session for a user
 * @param {number} userId - User ID
 * @param {string} ipAddress - User's IP address
 * @param {string} userAgent - User's browser/device information
 * @returns {Promise<SessionData>} - Session details with tokens
 */
export async function createSession(
  userId: number,
  ipAddress: string,
  userAgent: string,
): Promise<SessionData> {
  try {
    // Generate new tokens
    const accessToken = await createToken(
      {
        id: userId.toString(),
        type: constants.TOKEN_TYPES.ACCESS,
      },
      env.ACCESS_TOKEN_EXPIRY,
    );

    const refreshToken = await createToken(
      {
        id: userId.toString(),
        type: constants.TOKEN_TYPES.REFRESH,
      },
      env.REFRESH_TOKEN_EXPIRY,
      true,
    );

    // Hash tokens for secure storage
    const refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    const accessTokenHash = await bcrypt.hash(accessToken, SALT_ROUNDS);

    const expiresAt = new Date(
      Date.now() + parseTimeToMs(env.REFRESH_TOKEN_EXPIRY || "7d"),
    );

    // Option to limit number of active sessions per user
    const maxSessions = 5; // Configurable value
    const activeSessions = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.user_id, userId), eq(sessions.is_valid, true)));

    // If too many sessions, invalidate the oldest ones
    if (activeSessions.length >= maxSessions) {
      // Sort by last activity
      const sortedSessions = [...activeSessions].sort(
        (a, b) =>
          new Date(a.last_activity).getTime() -
          new Date(b.last_activity).getTime(),
      );

      // Invalidate oldest sessions to stay under limit
      for (let i = 0; i < sortedSessions.length - maxSessions + 1; i++) {
        await db
          .update(sessions)
          .set({ is_valid: false, updated_at: new Date() })
          .where(eq(sessions.id, sortedSessions[i].id));
      }
    }

    // Create new session record
    // Generate a session ID that's safe for PostgresSQL integer
    // Use a smaller, safe integer range (1 to 1,000,000)
    const sessionId = (Math.floor(Math.random() * 1000000) + 1).toString();

    await db.insert(sessions).values({
      id: parseInt(sessionId, 10),
      user_id: userId,
      token_hash: accessTokenHash,
      refresh_token_hash: refreshTokenHash,
      expires_at: expiresAt,
      last_activity: new Date(),
      ip_address: ipAddress,
      user_agent: userAgent,
      device_info: {},
      is_valid: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      sessionId,
    };
  } catch (error) {
    logger.error("Session creation error", error);
    throw new AppError("Failed to create session", 500);
  }
}

/**
 * Invalidate a user session
 * @param {string} tokenOrSessionId - Token or session ID to invalidate
 * @param {boolean} isToken - Whether the provided value is a token or session ID
 * @returns {Promise<boolean>} - Result of invalidation operation
 * @param {string} tokenOrSessionId - Token or session ID to invalidate
 * @param {boolean} isToken - Whether the provided value is a token or session ID
 * @returns {Promise<boolean>} - Result of invalidation operation
 */
export async function invalidateSession(
  tokenOrSessionId: string,
  isToken: boolean = true,
): Promise<boolean> {
  try {
    if (isToken) {
      try {
        const decoded = await verifyToken(tokenOrSessionId);

        if (!decoded || !decoded.id) {
          logger.warn("Invalid token during session invalidation");
          return false;
        }

        // Find sessions associated with this token
        const userSessions = await db
          .select()
          .from(sessions)
          .where(eq(sessions.user_id, Number(decoded.id)));

        // Try to find the specific session by hashing the token and comparing
        let foundSession = false;
        for (const session of userSessions) {
          if (await bcrypt.compare(tokenOrSessionId, session.token_hash)) {
            // Invalidate this specific session
            await db
              .update(sessions)
              .set({ is_valid: false, updated_at: new Date() })
              .where(eq(sessions.id, session.id));
            foundSession = true;
            break;
          }
        }

        // If no specific session found, invalidate all (fallback behavior)
        if (!foundSession && userSessions.length > 0) {
          logger.warn(
            "Could not find specific session, invalidating all for user",
          );
          for (const session of userSessions) {
            await db
              .update(sessions)
              .set({ is_valid: false, updated_at: new Date() })
              .where(eq(sessions.id, session.id));
          }
        }
      } catch (error) {
        logger.error(
          "Error during token verification for session invalidation",
          error,
        );
        return false;
      }
    } else {
      // Direct session ID invalidation
      // Ensure sessionId is a valid number
      const sessionIdNum = parseInt(tokenOrSessionId, 10);
      if (isNaN(sessionIdNum)) {
        logger.warn(`Invalid session ID format: ${tokenOrSessionId}`);
        return false;
      }

      const result = await db
        .update(sessions)
        .set({ is_valid: false, updated_at: new Date() })
        .where(eq(sessions.id, sessionIdNum));

      if (!result) {
        logger.warn(`Session not found for ID: ${tokenOrSessionId}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    logger.error("Session invalidation error", error);
    return false;
  }
}

/**
 * Update session activity timestamp
 * @param {string} sessionId - Session ID to update
 * @returns {Promise<boolean>} - Result of update operation
 * Update session activity timestamp
 * @param {string} sessionId - Session ID to update
 * @returns {Promise<boolean>} - Result of update operation
 */
export async function updateSessionActivity(
  sessionId: string,
): Promise<boolean> {
  try {
    // Ensure sessionId is a valid number
    const sessionIdNum = parseInt(sessionId, 10);
    if (isNaN(sessionIdNum)) {
      logger.warn(`Invalid session ID format: ${sessionId}`);
      return false;
    }

    await db
      .update(sessions)
      .set({
        last_activity: new Date(),
        updated_at: new Date(),
      })
      .where(eq(sessions.id, sessionIdNum));
    return true;
  } catch (error) {
    logger.error("Session activity update error", error);
    return false;
  }
}
/**
 * Send password reset email
 * @param {number} userId - User ID
 * @param {string} email - User's email address
 * @param {string} ipAddress - User's IP address
 * @returns {Promise<boolean>} - Result of operation
 * Send password reset email
 * @param {number} userId - User ID
 * @param {string} email - User's email address
 * @param {string} ipAddress - User's IP address
 * @returns {Promise<boolean>} - Result of operation
 */
export async function sendPasswordReset(
  userId: number,
  email: string,
  ipAddress: string,
): Promise<boolean> {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(token, SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + parseTimeToMs("1h"));

    // Invalidate any existing password reset tokens
    await db
      .update(password_reset_tokens)
      .set({ used: true })
      .where(
        and(
          eq(password_reset_tokens.user_id, userId),
          eq(password_reset_tokens.used, false),
        ),
      );

    // Create new password reset token
    await db.insert(password_reset_tokens).values({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      used: false,
      ip_address: ipAddress,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await sendPasswordResetEmail(email, {
      token,
      expiresAt,
    });

    return true;
  } catch (error) {
    logger.error("Password reset token creation error", error);
    throw new AppError("Failed to send password reset email", 500);
  }
}

/**
 * Verify email verification token
 * @param {string} token - Token to verify
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} - Result of verification
 * Verify email verification token
 * @param {string} token - Token to verify
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} - Result of verification
 */
export async function verifyEmailToken(
  token: string,
  userId: number,
): Promise<boolean> {
  return await withDbTransaction(async (txDb) => {
    const tokens = await txDb
      .select()
      .from(verification_tokens)
      .where(
        and(
          eq(verification_tokens.user_id, userId),
          eq(verification_tokens.type, "email"),
          eq(verification_tokens.used, false),
        ),
      );

    if (!tokens.length) {
      throw new AppError("Invalid verification token", 400);
    }

    let validToken = null;
    for (const dbToken of tokens) {
      try {
        if (await bcrypt.compare(token, dbToken.token_hash)) {
          validToken = dbToken;
          break;
        }
      } catch (error) {
        logger.warn("Error verifying token hash", error);
        // Continue to next token
      }
    }

    if (!validToken) {
      throw new AppError("Invalid verification token", 400);
    }

    if (validToken.expires_at < new Date()) {
      throw new AppError("Verification token has expired", 400);
    }

    await txDb
      .update(verification_tokens)
      .set({ used: true, updated_at: new Date() })
      .where(eq(verification_tokens.id, validToken.id));

    await txDb
      .update(users)
      .set({ email_verified: true, updated_at: new Date() })
      .where(eq(users.id, userId));

    return true;
  });
}
/**
 * Reset user password
 * @param {string} token - Password reset token
 * @param {number} userId - User ID
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} - Result of operation
 * Reset user password
 * @param {string} token - Password reset token
 * @param {number} userId - User ID
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} - Result of operation
 */
export async function resetPassword(
  token: string,
  userId: number,
  newPassword: string,
): Promise<boolean> {
  return await withDbTransaction(async (txDb) => {
    // Verify the token first
    let validToken = null;
    const tokens = await txDb
      .select()
      .from(password_reset_tokens)
      .where(
        and(
          eq(password_reset_tokens.user_id, userId),
          eq(password_reset_tokens.used, false),
        ),
      );

    for (const dbToken of tokens) {
      try {
        if (await bcrypt.compare(token, dbToken.token_hash)) {
          validToken = dbToken;
          break;
        }
      } catch (error) {
        logger.warn(
          "Error verifying reset token hash during password reset",
          error,
        );
        // Continue to next token
      }
    }

    if (!validToken) {
      throw new AppError("Invalid password reset token", 400);
    }

    if (validToken.expires_at < new Date()) {
      throw new AppError("Password reset token has expired", 400);
    }

    // Hash the new password
    const passwordHash = await hashPassword(newPassword);

    // Update the user's password
    await txDb
      .update(users)
      .set({
        password_hash: passwordHash,
        last_password_change: new Date(),
        updated_at: new Date(),
      })
      .where(eq(users.id, userId));

    // Mark the token as used
    await txDb
      .update(password_reset_tokens)
      .set({ used: true, updated_at: new Date() })
      .where(eq(password_reset_tokens.id, validToken.id));

    // Invalidate all existing sessions for security
    await txDb
      .update(sessions)
      .set({ is_valid: false, updated_at: new Date() })
      .where(eq(sessions.user_id, userId));

    return true;
  });
}

/**
 * Parse time string to milliseconds
 * @param {string} timeStr - Time string format (e.g., "30s", "15m", "24h", "7d")
 * @returns {number} - Time in milliseconds
 * Parse time string to milliseconds
 * @param {string} timeStr - Time string format (e.g., "30s", "15m", "24h", "7d")
 * @returns {number} - Time in milliseconds
 */
function parseTimeToMs(timeStr: string): number {
  const match = timeStr.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(
      `Invalid time format: ${timeStr}. Expected format: 30s, 15m, 24h, 7d`,
    );
  }

  const [, value, unit] = match;
  const num = parseInt(value, 10);

  switch (unit) {
    case "s":
      return num * 1000;
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "d":
      return num * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
}
