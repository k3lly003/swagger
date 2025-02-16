import { z } from 'zod';

// Common validation for custom questions
const customQuestionSchema = z.object({
  id: z.string().optional(), // Optional because it might be auto-generated
  question: z.string().min(2, 'Question must be at least 2 characters long'),
  field_type: z.enum(['text', 'textarea', 'select', 'multiselect', 'checkbox', 'radio', 'file']),
  options: z.array(z.string()).optional(),
  is_required: z.boolean().default(false),
  max_length: z.number().positive().optional(),
  order: z.number().nonnegative()
}).refine(
  (data) => {
    // If field type requires options, ensure they are provided
    if (['select', 'multiselect', 'checkbox', 'radio'].includes(data.field_type)) {
      return Array.isArray(data.options) && data.options.length > 0;
    }
    return true;
  },
  {
    message: 'Options are required for select, multiselect, checkbox, and radio field types',
    path: ['options']
  }
);

// Common validation for basic opportunity fields
const baseOpportunitySchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters long')
    .max(200, 'Title must be at most 200 characters long'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters long'),
  type: z.enum(['fellowship', 'employment']),
  status: z.enum(['draft', 'published', 'closed', 'cancelled']).default('draft'),
  
  location_type: z.enum(['remote', 'onsite', 'hybrid']).default('remote'),
  location: z.string().optional(),
  
  application_deadline: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
  
  eligibility_criteria: z.object({
    countries: z.array(z.string()).optional(),
    min_education_level: z.string().optional(),
    experience_years: z.number().nonnegative().optional(),
    skills_required: z.array(z.string()).optional(),
    other_requirements: z.array(z.string()).optional()
  }).optional(),
  
  custom_questions: z.array(customQuestionSchema).optional(),
  
  category_id: z.number().positive().optional()
});

// Fellowship-specific validation
const fellowshipDetailsSchema = z.object({
  program_name: z.string()
    .min(2, 'Program name must be at least 2 characters long')
    .max(200, 'Program name must be at most 200 characters long'),
  cohort: z.string().max(100).optional(),
  fellowship_type: z.string().max(100).optional(),
  
  learning_outcomes: z.array(z.string()).optional(),
  program_structure: z.object({
    phases: z.array(z.object({
      name: z.string(),
      description: z.string(),
      duration_weeks: z.number().positive()
    })).optional(),
    activities: z.array(z.string()).optional()
  }).optional()
});

// Employment-specific validation
const employmentDetailsSchema = z.object({
  position_level: z.string().max(100).optional(),
  employment_type: z.string()
    .min(2, 'Employment type must be at least 2 characters long')
    .max(100, 'Employment type must be at most 100 characters long'),
  department: z.string().max(100).optional(),
  
  responsibilities: z.array(z.string()).optional(),
  qualifications: z.object({
    required: z.array(z.string()).optional(),
    preferred: z.array(z.string()).optional()
  }).optional()
});

// Define params schema that transforms the ID into a number
const idParamsSchema = z.object({
  id: z.string()
    .refine(value => !isNaN(parseInt(value)), {
      message: 'ID must be a number'
    })
    .transform(val => parseInt(val)) // This transforms the string to a number
});

// Schema for creating a fellowship opportunity
export const createFellowshipSchema = z.object({
  body: baseOpportunitySchema.merge(z.object({
    type: z.literal('fellowship'),
    fellowship_details: fellowshipDetailsSchema
  }))
});

// Schema for creating an employment opportunity
export const createEmploymentSchema = z.object({
  body: baseOpportunitySchema.merge(z.object({
    type: z.literal('employment'),
    employment_details: employmentDetailsSchema
  }))
});

// Schema for getting an opportunity by ID
export const getOpportunitySchema = z.object({
  params: idParamsSchema
});

// Schema for updating a fellowship opportunity
export const updateFellowshipSchema = z.object({
  params: idParamsSchema,
  body: baseOpportunitySchema.partial().merge(z.object({
    type: z.literal('fellowship').optional(),
    fellowship_details: fellowshipDetailsSchema.partial().optional()
  }))
});

// Schema for updating an employment opportunity
export const updateEmploymentSchema = z.object({
  params: idParamsSchema,
  body: baseOpportunitySchema.partial().merge(z.object({
    type: z.literal('employment').optional(),
    employment_details: employmentDetailsSchema.partial().optional()
  }))
});

// Schema for application submission
export const applicationSubmissionSchema = z.object({
  params: idParamsSchema,
  body: z.object({
    // Standard required fields
    full_name: z.string()
      .min(2, 'Full name must be at least 2 characters long')
      .max(200, 'Full name must be at most 200 characters long'),
    email: z.string().email('Invalid email format'),
    phone: z.string().optional(),
    gender: z.enum(['male', 'female', 'non_binary', 'prefer_not_to_say', 'other']).optional(),
    nationality: z.string().optional(),
    country: z.string().optional(),
    
    education_level: z.enum([
      'high_school', 
      'associate_degree', 
      'bachelors_degree', 
      'masters_degree', 
      'doctorate', 
      'professional_certification', 
      'other'
    ]).optional(),
    institution: z.string().optional(),
    field_of_study: z.string().optional(),
    graduation_year: z.number().int().positive().optional(),
    certifications: z.array(z.string()).optional(),
    
    // Custom answers - schema will be validated dynamically based on opportunity questions
    custom_answers: z.record(z.string(), z.any()).optional()
  })
});

// Schema for updating application status
export const updateApplicationStatusSchema = z.object({
  params: idParamsSchema,
  body: z.object({
    status: z.enum([
      'submitted',
      'under_review',
      'shortlisted', 
      'interviewed', 
      'accepted', 
      'rejected', 
      'waitlisted', 
      'withdrawn'
    ])
  })
});

// Schema for submitting application review
export const applicationReviewSchema = z.object({
  params: idParamsSchema,
  body: z.object({
    score: z.number().min(1).max(10).optional(),
    comments: z.string().optional(),
    recommendation: z.string().optional()
  })
});

// Export all opportunity validation schemas
export const opportunityValidation = {
  createFellowshipSchema,
  createEmploymentSchema,
  getOpportunitySchema,
  updateFellowshipSchema,
  updateEmploymentSchema,
  applicationSubmissionSchema,
  updateApplicationStatusSchema,
  applicationReviewSchema
};

export default opportunityValidation;