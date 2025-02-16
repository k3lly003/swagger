import { 
    integer, 
    pgTable, 
    text, 
    timestamp, 
    jsonb, 
    serial, 
    varchar, 
    index,
    uniqueIndex,
    boolean,
    date
  } from 'drizzle-orm/pg-core';
  import { timestampFields } from './common';
  import { users } from './users';
  import { project_categories } from './projects';
  import {
    opportunityStatusEnum,
    opportunityTypeEnum,
    applicationStatusEnum,
    genderEnum,
    educationLevelEnum
  } from './enums';
  
  // Opportunities Table - Base table for both fellowships and job positions
  export const opportunities = pgTable('opportunities', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description').notNull(),
    type: opportunityTypeEnum('type').notNull(), // 'fellowship' or 'employment'
    status: opportunityStatusEnum('status').notNull().default('draft'), 
    location_type: varchar('location_type', { length: 50 }).notNull().default('remote'), // 'remote', 'onsite', 'hybrid'
    location: varchar('location', { length: 255 }),
    application_deadline: date('application_deadline').notNull(),
    // Eligibility criteria stored as JSON
    eligibility_criteria: jsonb('eligibility_criteria').$type<{
      countries?: string[];
      min_education_level?: string;
      experience_years?: number;
      skills_required?: string[];
      other_requirements?: string[];
    }>(),
    
    // Custom questions/fields for this opportunity
    custom_questions: jsonb('custom_questions').$type<Array<{
      id: string;
      question: string;
      field_type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file';
      options?: string[];
      is_required: boolean;
      max_length?: number;
      order: number;
    }>>(),
    
    // Relations
    category_id: integer('category_id')
      .references(() => project_categories.id),
    
    created_by: integer('created_by')
      .notNull()
      .references(() => users.id),
    ...timestampFields,
  }, (table) => {
    return {
      typeIdx: index('opportunities_type_idx').on(table.type),
      statusIdx: index('opportunities_status_idx').on(table.status),
      categoryIdx: index('opportunities_category_id_idx').on(table.category_id),
      createdByIdx: index('opportunities_created_by_idx').on(table.created_by),
    };
  });
  
  // Fellowship-specific details table (extends opportunities)
  export const fellowship_details = pgTable('fellowship_details', {
    id: serial('id').primaryKey(),
    opportunity_id: integer('opportunity_id')
      .notNull()
      .references(() => opportunities.id, { onDelete: 'cascade' }),
    program_name: varchar('program_name', { length: 200 }).notNull(),
    cohort: varchar('cohort', { length: 100 }),
    fellowship_type: varchar('fellowship_type', { length: 100 }), // 'research', 'professional', 'academic', etc.
    // Additional fellowship-specific fields
    learning_outcomes: jsonb('learning_outcomes').$type<string[]>(),
    program_structure: jsonb('program_structure').$type<{
      phases?: Array<{
        name: string;
        description: string;
        duration_weeks: number;
      }>;
      activities?: string[];
    }>(),
    
    ...timestampFields,
  }, (table) => {
    return {
      opportunityIdx: uniqueIndex('fellowship_details_opportunity_id_idx').on(table.opportunity_id),
    };
  });
  
  // Employment-specific details table (extends opportunities)
  export const employment_details = pgTable('employment_details', {
    id: serial('id').primaryKey(),
    opportunity_id: integer('opportunity_id')
      .notNull()
      .references(() => opportunities.id, { onDelete: 'cascade' }),
    
    position_level: varchar('position_level', { length: 100 }), // 'entry', 'mid', 'senior', etc.
    employment_type: varchar('employment_type', { length: 100 }).notNull(), // 'full-time', 'part-time', 'contract', etc.
    department: varchar('department', { length: 100 }),
    // Additional employment-specific fields
    responsibilities: jsonb('responsibilities').$type<string[]>(),
    qualifications: jsonb('qualifications').$type<{
      required: string[];
      preferred: string[];
    }>(),
    
    ...timestampFields,
  }, (table) => {
    return {
      opportunityIdx: uniqueIndex('employment_details_opportunity_id_idx').on(table.opportunity_id),
    };
  });
  
  // Applications Table - For storing applications to opportunities
  export const applications = pgTable('applications', {
    id: serial('id').primaryKey(),
    opportunity_id: integer('opportunity_id')
      .notNull()
      .references(() => opportunities.id),
    
    // Standard applicant information
    full_name: varchar('full_name', { length: 200 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    gender: genderEnum('gender'),
    nationality: varchar('nationality', { length: 100 }),
    country: varchar('country', { length: 100 }),
    
    // Education information
    education_level: educationLevelEnum('education_level'),
    institution: varchar('institution', { length: 200 }), // School/University
    field_of_study: varchar('field_of_study', { length: 200 }),
    graduation_year: integer('graduation_year'),
    certifications: jsonb('certifications').$type<string[]>(),
    
    // Resume/CV
    resume_url: varchar('resume_url', { length: 500 }),
    
    // Custom answers to opportunity-specific questions
    custom_answers: jsonb('custom_answers').$type<Record<string, any>>(),
    
    // Application status and tracking
    status: applicationStatusEnum('status').notNull().default('submitted'),
    submission_date: timestamp('submission_date', { withTimezone: true }).notNull().defaultNow(),
    
    // User reference if the applicant is a registered user
    user_id: integer('user_id')
      .references(() => users.id),
    
    ...timestampFields,
  }, (table) => {
    return {
      opportunityIdx: index('applications_opportunity_id_idx').on(table.opportunity_id),
      statusIdx: index('applications_status_idx').on(table.status),
      userIdx: index('applications_user_id_idx').on(table.user_id),
    };
  });
  
  // Application Reviews Table - For storing reviewer feedback on applications
  export const application_reviews = pgTable('application_reviews', {
    id: serial('id').primaryKey(),
    application_id: integer('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    reviewer_id: integer('reviewer_id')
      .notNull()
      .references(() => users.id),
    
    score: integer('score'), 
    comments: text('comments'), // Detailed feedback
    recommendation: varchar('recommendation', { length: 50 }), // 'accept', 'reject', 'waitlist', etc.
    
    ...timestampFields,
  }, (table) => {
    return {
      applicationIdx: index('application_reviews_application_id_idx').on(table.application_id),
      reviewerIdx: index('application_reviews_reviewer_id_idx').on(table.reviewer_id),
      uniqueReview: uniqueIndex('unique_application_reviewer').on(table.application_id, table.reviewer_id),
    };
  });