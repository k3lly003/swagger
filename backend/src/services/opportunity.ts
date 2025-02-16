import { db } from '../db/client';
import { 
    opportunities, 
    fellowship_details, 
    employment_details,
    applications,
    application_reviews
} from '../db/schema/opportunities';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { AppError } from '../middlewares';
import { Logger } from '../config';
import { v4 as uuidv4 } from 'uuid';

const logger = new Logger('OpportunityService');

// Input/Output types
export type CreateOpportunityInput = {
    title: string;
    description: string;
    type: 'fellowship' | 'employment';
    status?: 'draft' | 'published' | 'closed' | 'cancelled';
    location_type?: string;
    location?: string;
    application_deadline: string | Date;
    eligibility_criteria?: {
        countries?: string[];
        min_education_level?: string;
        experience_years?: number;
        skills_required?: string[];
        other_requirements?: string[];
    };
    custom_questions?: Array<{
        id?: string;
        question: string;
        field_type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file';
        options?: string[];
        is_required: boolean;
        max_length?: number;
        order: number;
    }>;
    category_id?: number;
    created_by: number;
    fellowship_details?: any;
    employment_details?: any;
};

export type UpdateOpportunityInput = Partial<Omit<CreateOpportunityInput, 'created_by'>>;

export type OpportunityFilters = {
    type?: string;
    status?: string;
    category_id?: number;
};

export type ApplicationInput = {
    opportunity_id: number;
    full_name: string;
    email: string;
    phone?: string;
    gender?: string;
    nationality?: string;
    country?: string;
    education_level?: string;
    institution?: string;
    field_of_study?: string;
    graduation_year?: number;
    certifications?: string[];
    resume_url?: string;
    custom_answers?: Record<string, any>;
    user_id?: number;
};

export type ReviewInput = {
    application_id: number;
    reviewer_id: number;
    score?: number;
    comments?: string;
    recommendation?: string;
};

// Opportunity service functions

// Create a new opportunity
export async function createOpportunity(opportunityData: CreateOpportunityInput): Promise<any> {
    try {
        // Begin a transaction
        return await db.transaction(async (tx) => {
            // Process custom questions - add IDs if not provided
            const customQuestions = opportunityData.custom_questions?.map(q => ({
                ...q,
                id: q.id || uuidv4() // Generate UUID for questions without ID
            }));

            // Prepare dates
            const applicationDeadline = new Date(opportunityData.application_deadline).toISOString();

            // Insert opportunity record
            const [createdOpportunity] = await tx.insert(opportunities).values({
                title: opportunityData.title,
                description: opportunityData.description,
                type: opportunityData.type,
                status: opportunityData.status || 'draft',
                location_type: opportunityData.location_type || 'remote',
                location: opportunityData.location,
                application_deadline: applicationDeadline,
                eligibility_criteria: opportunityData.eligibility_criteria,
                custom_questions: customQuestions,
                category_id: opportunityData.category_id,
                created_by: opportunityData.created_by,
                created_at: new Date(),
                updated_at: new Date()
            }).returning();

            let typeDetails = null;

            // Insert type-specific details based on opportunity type
            if (opportunityData.type === 'fellowship' && opportunityData.fellowship_details) {
                const [fellowshipDetail] = await tx.insert(fellowship_details).values({
                    opportunity_id: createdOpportunity.id,
                    program_name: opportunityData.fellowship_details.program_name,
                    cohort: opportunityData.fellowship_details.cohort,
                    fellowship_type: opportunityData.fellowship_details.fellowship_type,
                    learning_outcomes: opportunityData.fellowship_details.learning_outcomes,
                    program_structure: opportunityData.fellowship_details.program_structure,
                    created_at: new Date(),
                    updated_at: new Date()
                }).returning();
                
                typeDetails = fellowshipDetail;
            } else if (opportunityData.type === 'employment' && opportunityData.employment_details) {
                const [employmentDetail] = await tx.insert(employment_details).values({
                    opportunity_id: createdOpportunity.id,
                    position_level: opportunityData.employment_details.position_level,
                    employment_type: opportunityData.employment_details.employment_type,
                    department: opportunityData.employment_details.department,
                    responsibilities: opportunityData.employment_details.responsibilities,
                    qualifications: opportunityData.employment_details.qualifications,
                    created_at: new Date(),
                    updated_at: new Date()
                }).returning();
                
                typeDetails = employmentDetail;
            }

            // Return the complete opportunity with type-specific details directly
            // instead of making another database call
            return {
                ...createdOpportunity,
                [opportunityData.type === 'fellowship' ? 'fellowship_details' : 'employment_details']: typeDetails
            };
        });
    } catch (error) {
        logger.error('Error creating opportunity', error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to create opportunity', 500);
    }
}

// Get opportunity by ID
export async function getOpportunityById(id: number): Promise<any> {
    try {
        // Fetch the opportunity
        const opportunityResult = await db.select()
            .from(opportunities)
            .where(eq(opportunities.id, id))
            .limit(1);

        if (!opportunityResult.length) {
            throw new AppError('Opportunity not found', 404);
        }

        const opportunity = opportunityResult[0];

        // Fetch type-specific details
        let typeDetails = null;
        if (opportunity.type === 'fellowship') {
            const fellowshipResult = await db.select()
                .from(fellowship_details)
                .where(eq(fellowship_details.opportunity_id, id))
                .limit(1);
            
            typeDetails = fellowshipResult.length ? fellowshipResult[0] : null;
        } else if (opportunity.type === 'employment') {
            const employmentResult = await db.select()
                .from(employment_details)
                .where(eq(employment_details.opportunity_id, id))
                .limit(1);
            
            typeDetails = employmentResult.length ? employmentResult[0] : null;
        }

        // Return combined data
        return {
            ...opportunity,
            [opportunity.type === 'fellowship' ? 'fellowship_details' : 'employment_details']: typeDetails
        };
    } catch (error) {
        logger.error(`Error getting opportunity by ID: ${id}`, error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to get opportunity', 500);
    }
}

// Update opportunity
export async function updateOpportunity(id: number, updateData: UpdateOpportunityInput): Promise<any> {
    try {
        // Check if opportunity exists and get its type
        const existingOpportunity = await getOpportunityById(id);
        if (!existingOpportunity) {
            throw new AppError('Opportunity not found', 404);
        }

        return await db.transaction(async (tx) => {
            // Update custom questions - preserve IDs or generate new ones
            let customQuestions = undefined;
            if (updateData.custom_questions) {
                customQuestions = updateData.custom_questions.map(q => ({
                    ...q,
                    id: q.id || uuidv4() // Generate UUID for questions without ID
                }));
            }

            // Prepare dates
            const applicationDeadline = updateData.application_deadline 
                ? new Date(updateData.application_deadline).toISOString() 
                : undefined;

            // Update the base opportunity record
            await tx.update(opportunities)
                .set({
                    ...(updateData.title && { title: updateData.title }),
                    ...(updateData.description && { description: updateData.description }),
                    ...(updateData.status && { status: updateData.status }),
                    ...(updateData.location_type && { location_type: updateData.location_type }),
                    ...(updateData.location !== undefined && { location: updateData.location }),
                    ...(applicationDeadline && { application_deadline: applicationDeadline }),
                    ...(updateData.eligibility_criteria && { eligibility_criteria: updateData.eligibility_criteria }),
                    ...(customQuestions && { custom_questions: customQuestions }),
                    ...(updateData.category_id !== undefined && { category_id: updateData.category_id }),
                    updated_at: new Date()
                })
                .where(eq(opportunities.id, id));

            // Update type-specific details
            if (existingOpportunity.type === 'fellowship' && updateData.fellowship_details) {
                // Check if fellowship details exist
                const existingDetails = await tx.select()
                    .from(fellowship_details)
                    .where(eq(fellowship_details.opportunity_id, id))
                    .limit(1);

                if (existingDetails.length) {
                    // Update existing fellowship details
                    await tx.update(fellowship_details)
                        .set({
                            ...(updateData.fellowship_details.program_name && { 
                                program_name: updateData.fellowship_details.program_name 
                            }),
                            ...(updateData.fellowship_details.cohort !== undefined && { 
                                cohort: updateData.fellowship_details.cohort 
                            }),
                            ...(updateData.fellowship_details.fellowship_type !== undefined && { 
                                fellowship_type: updateData.fellowship_details.fellowship_type 
                            }),
                            ...(updateData.fellowship_details.learning_outcomes && { 
                                learning_outcomes: updateData.fellowship_details.learning_outcomes 
                            }),
                            ...(updateData.fellowship_details.program_structure && { 
                                program_structure: updateData.fellowship_details.program_structure 
                            }),
                            updated_at: new Date()
                        })
                        .where(eq(fellowship_details.opportunity_id, id));
                } else {
                    // Insert new fellowship details
                    await tx.insert(fellowship_details).values({
                        opportunity_id: id,
                        program_name: updateData.fellowship_details.program_name,
                        cohort: updateData.fellowship_details.cohort,
                        fellowship_type: updateData.fellowship_details.fellowship_type,
                        learning_outcomes: updateData.fellowship_details.learning_outcomes,
                        program_structure: updateData.fellowship_details.program_structure,
                        created_at: new Date(),
                        updated_at: new Date()
                    });
                }
            } else if (existingOpportunity.type === 'employment' && updateData.employment_details) {
                // Check if employment details exist
                const existingDetails = await tx.select()
                    .from(employment_details)
                    .where(eq(employment_details.opportunity_id, id))
                    .limit(1);

                if (existingDetails.length) {
                    // Update existing employment details
                    await tx.update(employment_details)
                        .set({
                            ...(updateData.employment_details.position_level !== undefined && { 
                                position_level: updateData.employment_details.position_level 
                            }),
                            ...(updateData.employment_details.employment_type && { 
                                employment_type: updateData.employment_details.employment_type 
                            }),
                            ...(updateData.employment_details.department !== undefined && { 
                                department: updateData.employment_details.department 
                            }),
                            ...(updateData.employment_details.responsibilities && { 
                                responsibilities: updateData.employment_details.responsibilities 
                            }),
                            ...(updateData.employment_details.qualifications && { 
                                qualifications: updateData.employment_details.qualifications 
                            }),
                            updated_at: new Date()
                        })
                        .where(eq(employment_details.opportunity_id, id));
                } else {
                    // Insert new employment details
                    await tx.insert(employment_details).values({
                        opportunity_id: id,
                        position_level: updateData.employment_details.position_level,
                        employment_type: updateData.employment_details.employment_type,
                        department: updateData.employment_details.department,
                        responsibilities: updateData.employment_details.responsibilities,
                        qualifications: updateData.employment_details.qualifications,
                        created_at: new Date(),
                        updated_at: new Date()
                    });
                }
            }

            // Return the updated opportunity
            return getOpportunityById(id);
        });
    } catch (error) {
        logger.error(`Error updating opportunity: ${id}`, error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to update opportunity', 500);
    }
}

// Update opportunity status
export async function updateOpportunityStatus(id: number, status: string): Promise<any> {
    try {
        // Check if opportunity exists
        const existingOpportunity = await getOpportunityById(id);
        if (!existingOpportunity) {
            throw new AppError('Opportunity not found', 404);
        }

        // Update the status
        await db.update(opportunities)
            .set({
                status: status as any,
                updated_at: new Date()
            })
            .where(eq(opportunities.id, id));

        // Return the updated opportunity
        return getOpportunityById(id);
    } catch (error) {
        logger.error(`Error updating opportunity status: ${id}`, error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to update opportunity status', 500);
    }
}

// Delete opportunity
export async function deleteOpportunity(id: number): Promise<boolean> {
    try {
        // Check if opportunity exists
        const existingOpportunity = await getOpportunityById(id);
        if (!existingOpportunity) {
            throw new AppError('Opportunity not found', 404);
        }

        // Delete the opportunity (cascade will handle dependent records)
        await db.delete(opportunities)
            .where(eq(opportunities.id, id));

        return true;
    } catch (error) {
        logger.error(`Error deleting opportunity: ${id}`, error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to delete opportunity', 500);
    }
}

// List opportunities with optional filters
export async function listOpportunities(filters: OpportunityFilters): Promise<any[]> {
    try {
        // Build query conditions based on filters
        const conditions = [];
        
        if (filters.type) {
            conditions.push(eq(opportunities.type, filters.type as any));
        }
        
        if (filters.status) {
            conditions.push(eq(opportunities.status, filters.status as any));
        }
        
        if (filters.category_id) {
            conditions.push(eq(opportunities.category_id, filters.category_id));
        }

        // Execute query with conditions
        const opportunitiesResult = conditions.length > 0
            ? await db.select().from(opportunities).where(and(...conditions))
            : await db.select().from(opportunities);

        // Get all unique opportunity IDs
        const opportunityIds = opportunitiesResult.map(opp => opp.id);
        
        // If no opportunities found, return empty array
        if (opportunityIds.length === 0) {
            return [];
        }

        // Fetch all related fellowship details in a single query
        const fellowshipDetailsResult = await db.select()
            .from(fellowship_details)
            .where(inArray(fellowship_details.opportunity_id, opportunityIds));

        const fellowshipDetailsMap = fellowshipDetailsResult.reduce((map, detail) => {
            map[detail.opportunity_id] = detail;
            return map;
        }, {} as Record<number, any>);

        // Fetch all related employment details in a single query
        const employmentDetailsResult = await db.select()
            .from(employment_details)
            .where(inArray(employment_details.opportunity_id, opportunityIds));

        const employmentDetailsMap = employmentDetailsResult.reduce((map, detail) => {
            map[detail.opportunity_id] = detail;
            return map;
        }, {} as Record<number, any>);

        // Combine opportunity data with type-specific details
        return opportunitiesResult.map(opportunity => {
            const detailsKey = opportunity.type === 'fellowship' ? 'fellowship_details' : 'employment_details';
            const details = opportunity.type === 'fellowship' 
                ? fellowshipDetailsMap[opportunity.id] 
                : employmentDetailsMap[opportunity.id];
            
            return {
                ...opportunity,
                [detailsKey]: details || null
            };
        });
    } catch (error) {
        logger.error('Error listing opportunities', error);
        throw new AppError('Failed to list opportunities', 500);
    }
}

// Application-related functions

// Submit a new application
export async function submitApplication(applicationData: ApplicationInput): Promise<any> {
    try {
        // Check if opportunity exists and is published
        const opportunity = await getOpportunityById(applicationData.opportunity_id);
        if (!opportunity) {
            throw new AppError('Opportunity not found', 404);
        }
        
        if (opportunity.status !== 'published') {
            throw new AppError('Applications can only be submitted for published opportunities', 400);
        }

        // Validate custom answers against opportunity's custom questions
        if (opportunity.custom_questions && opportunity.custom_questions.length > 0) {
            const requiredQuestions = opportunity.custom_questions
                .filter((q: any) => q.is_required)
                .map((q: any) => q.id);
            
            // Ensure all required questions have answers
            if (requiredQuestions.length > 0) {
                const providedAnswers = Object.keys(applicationData.custom_answers || {});
                const missingRequiredQuestions: string[] = requiredQuestions.filter((id: string) => !providedAnswers.includes(id));
                
                if (missingRequiredQuestions.length > 0) {
                    throw new AppError('All required questions must be answered', 400);
                }
            }
        }

        // Insert application record
        const [createdApplication] = await db.insert(applications).values({
            opportunity_id: applicationData.opportunity_id,
            full_name: applicationData.full_name,
            email: applicationData.email,
            phone: applicationData.phone,
            gender: applicationData.gender as any,
            nationality: applicationData.nationality,
            country: applicationData.country,
            education_level: applicationData.education_level as any,
            institution: applicationData.institution,
            field_of_study: applicationData.field_of_study,
            graduation_year: applicationData.graduation_year,
            certifications: applicationData.certifications,
            resume_url: applicationData.resume_url,
            custom_answers: applicationData.custom_answers || {},
            status: 'submitted',
            submission_date: new Date(),
            user_id: applicationData.user_id,
            created_at: new Date(),
            updated_at: new Date()
        }).returning();

        return createdApplication;
    } catch (error) {
        logger.error('Error submitting application', error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to submit application', 500);
    }
}

// Get application by ID
export async function getApplicationById(id: number): Promise<any> {
    try {
        const applicationResult = await db.select()
            .from(applications)
            .where(eq(applications.id, id))
            .limit(1);

        if (!applicationResult.length) {
            throw new AppError('Application not found', 404);
        }

        // Get reviews for this application
        const reviewsResult = await db.select()
            .from(application_reviews)
            .where(eq(application_reviews.application_id, id));

        // Return application with reviews
        return {
            ...applicationResult[0],
            reviews: reviewsResult
        };
    } catch (error) {
        logger.error(`Error getting application by ID: ${id}`, error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to get application', 500);
    }
}

// List applications for an opportunity with optional status filter
export async function listApplications(opportunityId: number, status?: string): Promise<any[]> {
    try {
        // Check if opportunity exists
        const opportunity = await getOpportunityById(opportunityId);
        if (!opportunity) {
            throw new AppError('Opportunity not found', 404);
        }

        // Build query conditions
        const conditions = [eq(applications.opportunity_id, opportunityId)];
        if (status) {
            conditions.push(eq(applications.status, status as any));
        }

        // Fetch applications
        return await db.select()
            .from(applications)
            .where(and(...conditions));
    } catch (error) {
        logger.error(`Error listing applications for opportunity: ${opportunityId}`, error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to list applications', 500);
    }
}

// Update application status
export async function updateApplicationStatus(id: number, status: string): Promise<any> {
    try {
        // Check if application exists
        const application = await getApplicationById(id);
        if (!application) {
            throw new AppError('Application not found', 404);
        }

        // Update status
        await db.update(applications)
            .set({
                status: status as any,
                updated_at: new Date()
            })
            .where(eq(applications.id, id));

        // Return updated application
        return getApplicationById(id);
    } catch (error) {
        logger.error(`Error updating application status: ${id}`, error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to update application status', 500);
    }
}

/**
 * List all applications across all opportunities with optional filtering
 */
export async function listAllApplications(status?: string, page: number = 1, limit: number = 10): Promise<any> {
    try {
        const offset = (page - 1) * limit;
        
        // Build query - using the full select() method instead of variable assignment
        // This avoids TypeScript losing type information through assignments
        
        // First, build the basic query
        const baseQuery = db.select().from(applications);
        
        // Apply filters if needed
        const filteredQuery = status 
            ? baseQuery.where(eq(applications.status, status as any))
            : baseQuery;
        
        // Apply pagination and execute
        const applicationResults = await filteredQuery.limit(limit).offset(offset);
        
        // Get total count for pagination
        const countResult = status 
            ? await db.select({ count: sql`count(*)` }).from(applications).where(eq(applications.status, status as any))
            : await db.select({ count: sql`count(*)` }).from(applications);
        
        const totalCount = Number(countResult[0]?.count || 0);
        
        // Get all opportunity IDs from the results
        const opportunityIds = [...new Set(applicationResults.map(app => app.opportunity_id))];
        
        // Fetch opportunity details for these IDs
        const opportunityDetails = opportunityIds.length > 0
            ? await db.select().from(opportunities).where(inArray(opportunities.id, opportunityIds))
            : [];
        
        // Create map of opportunity details
        const opportunityMap: Record<number, any> = {};
        opportunityDetails.forEach(opportunity => {
            opportunityMap[opportunity.id] = opportunity;
        });
        
        // Enhance applications with opportunity title
        const enhancedApplications = applicationResults.map(app => ({
            ...app,
            opportunity_title: opportunityMap[app.opportunity_id]?.title || 'Unknown Opportunity'
        }));
        
        return {
            items: enhancedApplications,
            pagination: {
                total: totalCount,
                page,
                limit,
                pages: Math.ceil(totalCount / limit)
            }
        };
    } catch (error) {
        logger.error('Error listing all applications', error);
        throw new AppError('Failed to list applications', 500);
    }
}

// Submit application review
export async function submitApplicationReview(reviewData: ReviewInput): Promise<any> {
    try {
        // Check if application exists
        const application = await getApplicationById(reviewData.application_id);
        if (!application) {
            throw new AppError('Application not found', 404);
        }

        // Check if reviewer has already reviewed this application
        const existingReview = await db.select()
            .from(application_reviews)
            .where(and(
                eq(application_reviews.application_id, reviewData.application_id),
                eq(application_reviews.reviewer_id, reviewData.reviewer_id)
            ))
            .limit(1);

        if (existingReview.length > 0) {
            // Update existing review
            await db.update(application_reviews)
                .set({
                    score: reviewData.score,
                    comments: reviewData.comments,
                    recommendation: reviewData.recommendation,
                    updated_at: new Date()
                })
                .where(and(
                    eq(application_reviews.application_id, reviewData.application_id),
                    eq(application_reviews.reviewer_id, reviewData.reviewer_id)
                ));

            // Return updated review
            const updatedReview = await db.select()
                .from(application_reviews)
                .where(and(
                    eq(application_reviews.application_id, reviewData.application_id),
                    eq(application_reviews.reviewer_id, reviewData.reviewer_id)
                ))
                .limit(1);

            return updatedReview[0];
        } else {
            // Create new review
            const [createdReview] = await db.insert(application_reviews).values({
                application_id: reviewData.application_id,
                reviewer_id: reviewData.reviewer_id,
                score: reviewData.score,
                comments: reviewData.comments,
                recommendation: reviewData.recommendation,
                created_at: new Date(),
                updated_at: new Date()
            }).returning();

            return createdReview;
        }
    } catch (error) {
        logger.error(`Error submitting application review: ${reviewData.application_id}`, error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to submit application review', 500);
    }
}

// Export the service functions
export const opportunityService = {
    createOpportunity,
    getOpportunityById,
    updateOpportunity,
    updateOpportunityStatus,
    deleteOpportunity,
    listOpportunities,
    submitApplication,
    getApplicationById,
    listApplications,
    updateApplicationStatus,
    submitApplicationReview,
    listAllApplications
};

// Default export for the service object
export default opportunityService;