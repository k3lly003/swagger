import { db } from "../db/client";
import { testimonials } from "../db/schema/testimonials";
import { eq } from "drizzle-orm";
import { AppError } from "../middlewares";
import { Logger } from "../config";

const logger = new Logger("TestimonialService");

// Testimonial types for service input/output
export type CreateTestimonialInput = {
  author_name: string;
  position?: string;
  image?: string;
  description: string;
  company?: string;
  occupation?: string;
  date?: Date | string;
  rating?: number;
};

export type UpdateTestimonialInput = {
  author_name?: string;
  position?: string;
  image?: string;
  description?: string;
  company?: string;
  occupation?: string;
  date?: Date | string;
  rating?: number;
};

export type TestimonialOutput = {
  id: number;
  author_name: string;
  position: string | null;
  image: string | null;
  description: string;
  company: string | null;
  occupation: string | null;
  date: Date;
  rating: number | null;
  created_at: Date;
  updated_at: Date;
};

// Create a new testimonial
export async function createTestimonial(
  testimonialData: CreateTestimonialInput,
): Promise<TestimonialOutput> {
  try {
    // Insert the testimonial
    const insertResult = await db
      .insert(testimonials)
      .values({
        author_name: testimonialData.author_name,
        position: testimonialData.position || null,
        image: testimonialData.image || null,
        description: testimonialData.description,
        company: testimonialData.company || null,
        occupation: testimonialData.occupation || null,
        date: testimonialData.date
          ? new Date(testimonialData.date)
          : new Date(),
        rating: testimonialData.rating || null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    if (!insertResult.length) {
      throw new AppError("Failed to create testimonial", 500);
    }

    return mapToTestimonialOutput(insertResult[0]);
  } catch (error) {
    logger.error("Error creating testimonial", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create testimonial", 500);
  }
}

// Get testimonial by ID
export async function getTestimonialById(
  id: number,
): Promise<TestimonialOutput> {
  try {
    const result = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1);

    if (!result.length) {
      throw new AppError("Testimonial not found", 404);
    }

    return mapToTestimonialOutput(result[0]);
  } catch (error) {
    logger.error(`Error getting testimonial by ID: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get testimonial", 500);
  }
}

// Update testimonial
export async function updateTestimonial(
  id: number,
  testimonialData: UpdateTestimonialInput,
): Promise<TestimonialOutput> {
  try {
    // Check if testimonial exists
    const existingTestimonial = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1);

    if (!existingTestimonial.length) {
      throw new AppError("Testimonial not found", 404);
    }

    // Prepare date field if provided
    const updateData: any = { ...testimonialData };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    // Update testimonial
    const updateResult = await db
      .update(testimonials)
      .set({
        ...updateData,
        updated_at: new Date(),
      })
      .where(eq(testimonials.id, id))
      .returning();

    if (!updateResult.length) {
      throw new AppError("Failed to update testimonial", 500);
    }

    return mapToTestimonialOutput(updateResult[0]);
  } catch (error) {
    logger.error(`Error updating testimonial: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update testimonial", 500);
  }
}

// Delete testimonial
export async function deleteTestimonial(id: number): Promise<boolean> {
  try {
    // Check if testimonial exists
    const existingTestimonial = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1);

    if (!existingTestimonial.length) {
      throw new AppError("Testimonial not found", 404);
    }

    // Delete the testimonial
    await db.delete(testimonials).where(eq(testimonials.id, id));

    return true;
  } catch (error) {
    logger.error(`Error deleting testimonial: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete testimonial", 500);
  }
}

// List all testimonials
export async function listTestimonials(): Promise<TestimonialOutput[]> {
  try {
    const result = await db.select().from(testimonials);

    return result.map(mapToTestimonialOutput);
  } catch (error) {
    logger.error("Error listing testimonials", error);
    throw new AppError("Failed to list testimonials", 500);
  }
}

// Helper function to map database testimonial to TestimonialOutput type
function mapToTestimonialOutput(testimonial: any): TestimonialOutput {
  return {
    id: testimonial.id,
    author_name: testimonial.author_name,
    position: testimonial.position,
    image: testimonial.image,
    description: testimonial.description,
    company: testimonial.company,
    occupation: testimonial.occupation,
    date: testimonial.date,
    rating: testimonial.rating,
    created_at: testimonial.created_at,
    updated_at: testimonial.updated_at,
  };
}

// Export the service functions
export const testimonialService = {
  createTestimonial,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  listTestimonials,
};

// Default export for the service object
export default testimonialService;
