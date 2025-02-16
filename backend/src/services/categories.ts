import { db } from "../db/client";
import { project_categories } from "../db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../middlewares";
import { Logger } from "../config";

const logger = new Logger("CategoryService");

// Category types for service input/output
export type CreateCategoryInput = {
  name: string;
  description?: string;
};

export type UpdateCategoryInput = {
  name?: string;
  description?: string;
};

export type CategoryOutput = {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

// Create a new category
export async function createCategory(
  categoryData: CreateCategoryInput,
): Promise<CategoryOutput> {
  try {
    // Check if a category with the same name already exists
    const existingCategory = await db
      .select()
      .from(project_categories)
      .where(eq(project_categories.name, categoryData.name))
      .limit(1);

    if (existingCategory.length > 0) {
      throw new AppError(
        `Category with name '${categoryData.name}' already exists`,
        409,
      );
    }

    // Insert the category
    await db.insert(project_categories).values({
      name: categoryData.name,
      description: categoryData.description || null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Get the created category
    const createdCategory = await db
      .select()
      .from(project_categories)
      .where(eq(project_categories.name, categoryData.name))
      .limit(1);

    if (!createdCategory.length) {
      throw new AppError("Failed to create category", 500);
    }

    return mapToCategoryOutput(createdCategory[0]);
  } catch (error) {
    logger.error("Error creating category", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create category", 500);
  }
}

// Get category by ID
export async function getCategoryById(id: number): Promise<CategoryOutput> {
  try {
    const result = await db
      .select()
      .from(project_categories)
      .where(eq(project_categories.id, id))
      .limit(1);

    if (!result.length) {
      throw new AppError("Category not found", 404);
    }

    return mapToCategoryOutput(result[0]);
  } catch (error) {
    logger.error(`Error getting category by ID: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get category", 500);
  }
}

// Update category
export async function updateCategory(
  id: number,
  categoryData: UpdateCategoryInput,
): Promise<CategoryOutput> {
  try {
    // Check if category exists
    const existingCategory = await db
      .select()
      .from(project_categories)
      .where(eq(project_categories.id, id))
      .limit(1);

    if (!existingCategory.length) {
      throw new AppError("Category not found", 404);
    }

    // If updating name, check if the new name already exists
    if (categoryData.name && categoryData.name !== existingCategory[0].name) {
      const nameExists = await db
        .select()
        .from(project_categories)
        .where(eq(project_categories.name, categoryData.name))
        .limit(1);

      if (nameExists.length > 0) {
        throw new AppError(
          `Category with name '${categoryData.name}' already exists`,
          409,
        );
      }
    }

    // Update category
    await db
      .update(project_categories)
      .set({
        ...categoryData,
        updated_at: new Date(),
      })
      .where(eq(project_categories.id, id));

    // Get updated category
    const updatedCategory = await db
      .select()
      .from(project_categories)
      .where(eq(project_categories.id, id))
      .limit(1);

    return mapToCategoryOutput(updatedCategory[0]);
  } catch (error) {
    logger.error(`Error updating category: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update category", 500);
  }
}

// Delete category
export async function deleteCategory(id: number): Promise<boolean> {
  try {
    // Check if category exists
    const existingCategory = await db
      .select()
      .from(project_categories)
      .where(eq(project_categories.id, id))
      .limit(1);

    if (!existingCategory.length) {
      throw new AppError("Category not found", 404);
    }

    // Check if the category is used by any projects
    // If you have a projects table with a category_id foreign key, you should add a check here
    // to prevent deletion of categories that are in use

    // Delete the category
    await db.delete(project_categories).where(eq(project_categories.id, id));

    return true;
  } catch (error) {
    logger.error(`Error deleting category: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete category", 500);
  }
}

// List all categories
export async function listCategories(): Promise<CategoryOutput[]> {
  try {
    const result = await db.select().from(project_categories);

    return result.map(mapToCategoryOutput);
  } catch (error) {
    logger.error("Error listing categories", error);
    throw new AppError("Failed to list categories", 500);
  }
}

// Helper function to map database category to CategoryOutput type
function mapToCategoryOutput(category: any): CategoryOutput {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    created_at: category.created_at,
    updated_at: category.updated_at,
  };
}

// Export the service functions
export const categoryService = {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  listCategories,
};

// Default export for the service object
export default categoryService;
