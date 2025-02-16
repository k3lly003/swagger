import { db } from "../db/client";
import { faqs } from "../db/schema/faqs";
import { eq, desc } from "drizzle-orm";
import { AppError } from "../middlewares";
import { Logger } from "../config";

const logger = new Logger("FaqService");

// FAQ types for service input/output
export type CreateFaqInput = {
  question: string;
  answer: string;
  is_active?: boolean;
};

export type UpdateFaqInput = {
  question?: string;
  answer?: string;
  is_active?: boolean;
  view_count?: number;
};

export type FaqOutput = {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
  view_count: number;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
};

// Create a new FAQ
// Create a new FAQ
export async function createFaq(faqData: CreateFaqInput): Promise<FaqOutput> {
  try {
    // Insert the FAQ
    await db.insert(faqs).values({
      question: faqData.question,
      answer: faqData.answer,
      is_active: faqData.is_active !== undefined ? faqData.is_active : true,
      view_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const createdFaq = await db
      .select()
      .from(faqs)
      .where(eq(faqs.question, faqData.question))
      .orderBy(desc(faqs.created_at))
      .limit(1);

    if (!createdFaq.length) {
      throw new AppError("Failed to create FAQ", 500);
    }

    return mapToFaqOutput(createdFaq[0]);
  } catch (error) {
    logger.error("Error creating FAQ", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create FAQ", 500);
  }
}

// Get FAQ by ID
export async function getFaqById(id: number): Promise<FaqOutput> {
  try {
    const result = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);

    if (!result.length) {
      throw new AppError("FAQ not found", 404);
    }

    return mapToFaqOutput(result[0]);
  } catch (error) {
    logger.error(`Error getting FAQ by ID: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get FAQ", 500);
  }
}

// Increment view count for an FAQ
export async function incrementViewCount(id: number): Promise<boolean> {
  try {
    const result = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);

    if (!result.length) {
      throw new AppError("FAQ not found", 404);
    }

    await db
      .update(faqs)
      .set({
        view_count: result[0].view_count + 1,
        updated_at: new Date(),
      })
      .where(eq(faqs.id, id));

    return true;
  } catch (error) {
    logger.error(`Error incrementing view count for FAQ: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to increment view count", 500);
  }
}

// Update FAQ
export async function updateFaq(
  id: number,
  faqData: UpdateFaqInput,
): Promise<FaqOutput> {
  try {
    // Check if FAQ exists
    const existingFaq = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, id))
      .limit(1);

    if (!existingFaq.length) {
      throw new AppError("FAQ not found", 404);
    }

    // Update FAQ
    await db
      .update(faqs)
      .set({
        ...faqData,
        updated_at: new Date(),
      })
      .where(eq(faqs.id, id));

    // Get updated FAQ
    const updatedFaq = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, id))
      .limit(1);

    return mapToFaqOutput(updatedFaq[0]);
  } catch (error) {
    logger.error(`Error updating FAQ: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update FAQ", 500);
  }
}

// Delete FAQ
export async function deleteFaq(id: number): Promise<boolean> {
  try {
    // Check if FAQ exists
    const existingFaq = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, id))
      .limit(1);

    if (!existingFaq.length) {
      throw new AppError("FAQ not found", 404);
    }

    // Delete the FAQ
    await db.delete(faqs).where(eq(faqs.id, id));

    return true;
  } catch (error) {
    logger.error(`Error deleting FAQ: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete FAQ", 500);
  }
}
export async function listFaqs(
    activeOnly: boolean = false,
): Promise<FaqOutput[]> {
  try {
    // Instead of conditionally modifying the query, create different queries
    const result = activeOnly
        ? await db.select().from(faqs).where(eq(faqs.is_active, true))
        : await db.select().from(faqs);

    return result.map(mapToFaqOutput);
  } catch (error) {
    logger.error("Error listing FAQs", error);
    throw new AppError("Failed to list FAQs", 500);
  }
}

// Helper function to map database FAQ to FaqOutput type
function mapToFaqOutput(faq: any): FaqOutput {
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    is_active: faq.is_active,
    view_count: faq.view_count,
    created_by: faq.created_by,
    created_at: faq.created_at,
    updated_at: faq.updated_at,
  };
}

// Export the service functions
export const faqService = {
  createFaq,
  getFaqById,
  updateFaq,
  deleteFaq,
  listFaqs,
  incrementViewCount,
};

export default faqService;
