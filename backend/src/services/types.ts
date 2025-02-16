export interface User {
  id: number;
  email: string;
  name: string;
  role_id: number;
  password_hash: string;
  avatar_url?: string | null;
  two_factor_enabled: boolean;
  two_factor_method?: string | null;
  backup_codes?: any | null;
  email_verified: boolean;
  phone_number?: string | null;
  phone_verified: boolean;
  last_password_change?: Date | null;
  last_login?: Date | null;
  is_active: boolean;
  account_locked: boolean;
  failed_login_attempts: number;
  last_failed_attempt?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role_id: number;
  avatar_url?: string;
  email_verified?: boolean;
  sendVerificationEmail?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  role_id?: number;
  avatar_url?: string;
  email_verified?: boolean;
  is_active?: boolean;
  account_locked?: boolean;
  failed_login_attempts?: number;
  last_failed_attempt?: Date | null;
  last_login?: Date | null;
  last_password_change?: Date | null;
}

export interface UserProfile {
  id: number;
  user_id: number;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  social_links?: any | null;
  preferences?: any | null;
  created_at: Date;
  updated_at: Date;
}

// New interface for role information
export interface Role {
  id: number;
  name: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
}
