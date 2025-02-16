import { z } from "zod";

// Base email and password validation
const email = z.string().email("Invalid email address");
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

// Login validation
export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1, "Password is required"),
    remember_me: z.boolean().optional(),
  }),
});

// Register validation
export const registerSchema = z.object({
  body: z
    .object({
      email,
      password,
      confirm_password: z.string().min(1, "Please confirm your password"),
      name: z.string().min(1, "Name is required"),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    }),
});

// Password reset request validation
export const forgotPasswordSchema = z.object({
  body: z.object({
    email,
  }),
});

// Password reset validation
export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string().min(1, "Token is required"),
      password,
      confirm_password: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    }),
});

// Email verification validation
export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
  }),
});

// Refresh token validation
export const refreshTokenSchema = z.object({
  body: z.object({
    refresh_token: z.string().min(1, "Refresh token is required"),
  }),
});
