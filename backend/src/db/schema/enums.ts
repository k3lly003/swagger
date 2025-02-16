import { pgEnum } from "drizzle-orm/pg-core";

export const mediaTypeEnum = pgEnum("media_type", ["image", "video"]);

export const twoFactorMethodEnum = pgEnum("two_factor_method", [
  "authenticator",
  "sms",
  "email",
]);
// News related enums
export const newsStatusEnum = pgEnum("news_status", [
  "published",
  "not_published",
]);


export const newsCategoryEnum = pgEnum("news_category", [
  "all",
  "news",
  "blogs",
  "reports",
  "publications",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "planned",
  "active",
  "completed",
  "cancelled",
  "on_hold",
]);
// Media tag enum
export const mediaTagEnum = pgEnum("media_tag", [
  "feature", 
  "description", 
  "others"
]);

export const projectMemberRoleEnum = pgEnum("project_member_role", [
  "lead",
  "member",
  "supervisor",
  "contributor",
]);

export const jobTypeEnum = pgEnum("job_type", ["fellowship", "employment"]);

export const jobPostingTypeEnum = pgEnum("job_posting_type", [
  "internal",
  "external",
  "partner",
]);

export const postingStatusEnum = pgEnum("posting_status", [
  "draft",
  "published",
  "closed",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "cv",
  "cover_letter",
  "certificate",
  "other",
]);

export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
  "archived",
]);

export const resourceTypeEnum = pgEnum("resource_type", [
  "document",
  "video",
  "guide",
  "research",
]);

export const resourceAccessEnum = pgEnum("resource_access", [
  "public",
  "fellow",
  "employee",
  "alumni",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "public",
  "internal",
  "training",
]);

export const attendeeStatusEnum = pgEnum("attendee_status", [
  "registered",
  "attended",
  "cancelled",
]);

export const mentorshipTypeEnum = pgEnum("mentorship_type", [
  "fellow_mentor",
  "peer_mentor",
  "alumni_mentor",
]);

export const mentorshipStatusEnum = pgEnum("mentorship_status", [
  "active",
  "completed",
  "paused",
]);


// Opportunity status enum
export const opportunityStatusEnum = pgEnum('opportunity_status', [
  'draft',
  'published',
  'closed',
  'cancelled'
]);

// Opportunity type enum
export const opportunityTypeEnum = pgEnum('opportunity_type', [
  'fellowship',
  'employment'
]);

// Application status enum
export const applicationStatusEnum = pgEnum('application_status', [
  'submitted',
  'under_review',
  'shortlisted',
  'interviewed',
  'accepted',
  'rejected',
  'waitlisted',
  'withdrawn'
]);

// Gender enum
export const genderEnum = pgEnum('gender', [
  'male',
  'female',
  'non_binary',
  'prefer_not_to_say',
  'other'
]);

// Education level enum
export const educationLevelEnum = pgEnum('education_level', [
  'high_school',
  'associate_degree',
  'bachelors_degree',
  'masters_degree',
  'doctorate',
  'professional_certification',
  'other'
]);


export const verificationTypeEnum = pgEnum("verification_type", [
  "email",
  "phone",
]);

export const contextTypeEnum = pgEnum("context_type", [
  "project",
  "department",
  "personal_development",
  "other",
]);
