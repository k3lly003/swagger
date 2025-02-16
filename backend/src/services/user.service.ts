import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "@/middlewares";
import { constants } from "../config";
import { hashPassword } from "./auth.service";
import { User, CreateUserInput, UpdateUserInput } from "@/services/types";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "@/services/email.service";
import { createToken } from "./auth.service";

/**
 * Create a new user
 */
export const createUser = async (userData: CreateUserInput): Promise<User> => {
  // Check if email already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, userData.email),
  });

  if (existingUser) {
    throw new AppError(constants.ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, 409);
  }
  if (existingUser) {
    throw new AppError(constants.ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, 409);
  }

  // Hash password
  const password_hash = await hashPassword(userData.password);

  // Insert user into database
  const [newUser] = await db
    .insert(users)
    .values({
      email: userData.email,
      name: userData.name,
      password_hash,
      role_id: userData.role_id,
      email_verified: userData.email_verified || false,
      avatar_url: userData.avatar_url,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning();

  if (!newUser) {
    throw new AppError(constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
  }

  // Send verification email if requested and not already verified
  if (userData.sendVerificationEmail && !userData.email_verified) {
    try {
      // Create a verification token (24 hour expiry)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const token = await createToken(
        {
          id: newUser.id.toString(),
          type: "verify_email", // assuming this is the token type for email verification
        },
        "24h", // token expiry time
      );

      // Send the verification email
      await sendVerificationEmail(newUser.email, {
        token,
        expiresAt,
      });

      // Optionally also send a welcome email
      await sendWelcomeEmail(newUser.email, newUser.name);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Don't fail the user creation if email sending fails
    }
  }

  return newUser;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: number | string): Promise<User> => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(id)),
  });

  if (!user) {
    throw new AppError(constants.ERROR_MESSAGES.NOT_FOUND, 404);
  }

  return user;
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<User> => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new AppError(constants.ERROR_MESSAGES.NOT_FOUND, 404);
  }

  return user;
};

/**
 * Update user
 */
export const updateUser = async (
  id: number | string,
  userData: UpdateUserInput,
): Promise<User> => {
  const [updatedUser] = await db
    .update(users)
    .set({
      ...userData,
      // No need to cast role_id as it's now a direct integer
      updated_at: new Date(),
    })
    .where(eq(users.id, Number(id)))
    .returning();

  if (!updatedUser) {
    throw new AppError(constants.ERROR_MESSAGES.NOT_FOUND, 404);
  }

  return updatedUser;
};
/**
 * Delete user (soft delete)
 */
export const deleteUser = async (id: number | string): Promise<void> => {
  // Implement as soft delete using is_active field
  const [updatedUser] = await db
    .update(users)
    .set({
      is_active: false,
      updated_at: new Date(),
    })
    .where(eq(users.id, Number(id)))
    .returning();

  if (!updatedUser) {
    throw new AppError(constants.ERROR_MESSAGES.USER_NOT_FOUND, 404);
  }
};

/**
 * List users with filtering and pagination
 */
export const listUsers = async (params: any) => {
  const {
    page = 1,
    limit = 10,
    search,
    sort_by = "created_at",
    sort_order = "desc",
    role_id,
    is_active,
  } = params;

  // Build where conditions
  const whereConditions = [];

  if (search) {
    whereConditions.push(
      `(u.name ILIKE '%${search}%' OR u.email ILIKE '%${search}%')`,
    );
  }

  if (role_id) {
    whereConditions.push(`u.role_id = ${role_id}`);
  }

  if (typeof is_active === "boolean") {
    whereConditions.push(`u.is_active = ${is_active}`);
  }

  // Build where clause
  const whereClause = whereConditions.length
    ? `WHERE ${whereConditions.join(" AND ")}`
    : "";

  // Count total matching users
  const countQuery = `SELECT COUNT(*) as total FROM users u ${whereClause}`;
  console.log("Count query:", countQuery);

  const countResults = await db.execute(countQuery);
  console.log("Count results:", countResults);
  const total = parseInt(String(countResults.rows?.[0]?.total || "0"), 10);

  // Get paginated users
  const offset = (page - 1) * limit;

  const usersQuery = `
    SELECT u.*, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    ${whereClause}
    ORDER BY u.${sort_by} ${sort_order === "asc" ? "ASC" : "DESC"}
    LIMIT ${limit} OFFSET ${offset}
  `;
  console.log("Users query:", usersQuery);

  const usersResults = await db.execute(usersQuery);
  console.log("Users results structure:", Object.keys(usersResults));

  // Return the users and total
  return {
    users: usersResults.rows || [],
    total,
  };
};
/**
 * Import multiple users (for bulk operations)
 */
export const importUsers = async (
  usersData: CreateUserInput[],
): Promise<{
  successful: number;
  failed: number;
  errors: any[];
}> => {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as any[],
  };

  // Process each user
  for (const userData of usersData) {
    try {
      await createUser(userData);
      results.successful++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        email: userData.email,
        error: error instanceof AppError ? error.message : "Unknown error",
      });
    }
  }

  return results;
};
