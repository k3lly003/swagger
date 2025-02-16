import { db } from "../db/client";
import { partners } from "../db/schema/partners";
import { eq } from "drizzle-orm";
import { AppError } from "../middlewares";
import { Logger } from "../config";

const logger = new Logger("PartnerService");

// Partner types for service input/output
export type CreatePartnerInput = {
  name: string;
  logo?: string;
  website_url?: string;
  location?: string;
};

export type UpdatePartnerInput = {
  name?: string;
  logo?: string;
  website_url?: string;
  location?: string;
};

export type PartnerOutput = {
  id: number;
  name: string;
  logo: string | null;
  website_url: string | null;
  location: string | null;
  created_at: Date;
  updated_at: Date;
};

// Create a new partner
export async function createPartner(
  partnerData: CreatePartnerInput,
): Promise<PartnerOutput> {
  try {
    // Check if a partner with the same name already exists
    const existingPartner = await db
      .select()
      .from(partners)
      .where(eq(partners.name, partnerData.name))
      .limit(1);

    if (existingPartner.length > 0) {
      throw new AppError(
        `Partner with name '${partnerData.name}' already exists`,
        409,
      );
    }

    // Insert the partner
    await db.insert(partners).values({
      name: partnerData.name,
      logo: partnerData.logo || null,
      website_url: partnerData.website_url || null,
      location: partnerData.location || null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Get the created partner
    const createdPartner = await db
      .select()
      .from(partners)
      .where(eq(partners.name, partnerData.name))
      .limit(1);

    if (!createdPartner.length) {
      throw new AppError("Failed to create partner", 500);
    }

    return mapToPartnerOutput(createdPartner[0]);
  } catch (error) {
    logger.error("Error creating partner", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create partner", 500);
  }
}

// Get partner by ID
export async function getPartnerById(id: number): Promise<PartnerOutput> {
  try {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.id, id))
      .limit(1);

    if (!result.length) {
      throw new AppError("Partner not found", 404);
    }

    return mapToPartnerOutput(result[0]);
  } catch (error) {
    logger.error(`Error getting partner by ID: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get partner", 500);
  }
}

// Update partner
export async function updatePartner(
  id: number,
  partnerData: UpdatePartnerInput,
): Promise<PartnerOutput> {
  try {
    // Check if partner exists
    const existingPartner = await db
      .select()
      .from(partners)
      .where(eq(partners.id, id))
      .limit(1);

    if (!existingPartner.length) {
      throw new AppError("Partner not found", 404);
    }

    // If updating name, check if the new name already exists
    if (partnerData.name && partnerData.name !== existingPartner[0].name) {
      const nameExists = await db
        .select()
        .from(partners)
        .where(eq(partners.name, partnerData.name))
        .limit(1);

      if (nameExists.length > 0) {
        throw new AppError(
          `Partner with name '${partnerData.name}' already exists`,
          409,
        );
      }
    }

    // Update partner
    await db
      .update(partners)
      .set({
        ...partnerData,
        updated_at: new Date(),
      })
      .where(eq(partners.id, id));

    // Get updated partner
    const updatedPartner = await db
      .select()
      .from(partners)
      .where(eq(partners.id, id))
      .limit(1);

    return mapToPartnerOutput(updatedPartner[0]);
  } catch (error) {
    logger.error(`Error updating partner: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update partner", 500);
  }
}

// Delete partner
export async function deletePartner(id: number): Promise<boolean> {
  try {
    // Check if partner exists
    const existingPartner = await db
      .select()
      .from(partners)
      .where(eq(partners.id, id))
      .limit(1);

    if (!existingPartner.length) {
      throw new AppError("Partner not found", 404);
    }

    // Delete the partner
    await db.delete(partners).where(eq(partners.id, id));

    return true;
  } catch (error) {
    logger.error(`Error deleting partner: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete partner", 500);
  }
}

// List all partners
export async function listPartners(): Promise<PartnerOutput[]> {
  try {
    const result = await db.select().from(partners);

    return result.map(mapToPartnerOutput);
  } catch (error) {
    logger.error("Error listing partners", error);
    throw new AppError("Failed to list partners", 500);
  }
}

// Helper function to map database partner to PartnerOutput type
function mapToPartnerOutput(partner: any): PartnerOutput {
  return {
    id: partner.id,
    name: partner.name,
    logo: partner.logo,
    website_url: partner.website_url,
    location: partner.location,
    created_at: partner.created_at,
    updated_at: partner.updated_at,
  };
}

// Export the service functions
export const partnerService = {
  createPartner,
  getPartnerById,
  updatePartner,
  deletePartner,
  listPartners,
};

// Default export for the service object
export default partnerService;
