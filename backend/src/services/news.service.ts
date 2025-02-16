import { db } from "../db/client";
import { news, news_tags, news_to_tags } from "../db/schema/news";
import { eq, inArray, and, desc, asc, sql, or, ilike } from "drizzle-orm";
import { AppError } from "../middlewares";
import { Logger } from "../config";

const logger = new Logger("NewsService");

// News types for service input/output
export type CreateNewsInput = {
  title: string;
  content: string;
  status: "published" | "not_published";
  publish_date?: Date;
  category: "all" | "news" | "blogs" | "reports" | "publications";
  key_lessons?: string;
  media?: {
    items: Array<{
      id: string;
      type: "image" | "video";
      url: string;
      cover: boolean;
      size?: number;
      duration?: number;
      thumbnailUrl?: string;
      order?: number;
    }>;
  };
  tags?: number[]; // Array of tag IDs
  created_by: number; // User ID of the creator
};

export type UpdateNewsInput = {
  title?: string;
  content?: string;
  status?: "published" | "not_published";
  publish_date?: Date | null;
  category?: "all" | "news" | "blogs" | "reports" | "publications";
  key_lessons?: string | null;
  media?: {
    items: Array<{
      id: string;
      type: "image" | "video";
      url: string;
      cover: boolean;
      size?: number;
      duration?: number;
      thumbnailUrl?: string;
      order?: number;
    }>;
  } | null;
  tags?: number[]; // Array of tag IDs
};

export type NewsFilter = {
  category?: "all" | "news" | "blogs" | "reports" | "publications";
  status?: "published" | "not_published";
  search?: string;
  tags?: number[];
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type NewsOutput = {
  id: number;
  title: string;
  content: string;
  status: string;
  publish_date: Date | null;
  category: string;
  key_lessons: string | null;
  media: {
    items: Array<{
      id: string;
      type: string;
      url: string;
      cover: boolean;
      size?: number;
      duration?: number;
      thumbnailUrl?: string;
      order?: number;
    }>;
  } | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  tags: Array<{ id: number; name: string }>;
};

// Create a new news item
export async function createNews(
  newsData: CreateNewsInput,
): Promise<NewsOutput> {
  try {
    // Start transaction
    return await db.transaction(async (tx) => {
      // Insert the news item
      const result = await tx
        .insert(news)
        .values({
          title: newsData.title,
          content: newsData.content,
          status: newsData.status,
          publish_date:
            newsData.status === "published"
              ? newsData.publish_date || new Date()
              : null,
          category: newsData.category,
          key_lessons: newsData.key_lessons || null,
          media: newsData.media || null,
          created_by: newsData.created_by,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      if (!result.length) {
        throw new AppError("Failed to create news item", 500);
      }

      const createdNews = result[0];

      // Log the created news ID to help with debugging
      console.log(`Created news with ID: ${createdNews.id}`);

      // Associate tags if provided
      if (newsData.tags && newsData.tags.length > 0) {
        // Verify all tags exist
        const existingTags = await tx
          .select({ id: news_tags.id })
          .from(news_tags)
          .where(inArray(news_tags.id, newsData.tags));

        if (existingTags.length !== newsData.tags.length) {
          throw new AppError("One or more tags do not exist", 400);
        }

        // Create tag associations
        const tagAssociations = newsData.tags.map((tagId) => ({
          news_id: createdNews.id,
          tag_id: tagId,
        }));

        await tx.insert(news_to_tags).values(tagAssociations);
      }

      // Get the tags for the created news
      const tagResults = await tx
        .select({
          id: news_tags.id,
          name: news_tags.name,
        })
        .from(news_to_tags)
        .innerJoin(news_tags, eq(news_to_tags.tag_id, news_tags.id))
        .where(eq(news_to_tags.news_id, createdNews.id));

      // Return the news with its tags directly instead of calling getNewsById
      return {
        ...createdNews,
        tags: tagResults,
      };
    });
  } catch (error) {
    logger.error("Error creating news", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create news item", 500);
  }
}

// Get news by ID
export async function getNewsById(id: number): Promise<NewsOutput> {
  try {
    // Get the news item
    const result = await db.select().from(news).where(eq(news.id, id)).limit(1);

    if (!result.length) {
      throw new AppError("News item not found", 404);
    }

    const newsItem = result[0];

    // Get associated tags
    const tagResults = await db
      .select({
        id: news_tags.id,
        name: news_tags.name,
      })
      .from(news_to_tags)
      .innerJoin(news_tags, eq(news_to_tags.tag_id, news_tags.id))
      .where(eq(news_to_tags.news_id, id));

    return {
      ...newsItem,
      tags: tagResults,
    };
  } catch (error) {
    logger.error(`Error getting news by ID: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get news item", 500);
  }
}

// Update news
export async function updateNews(
  id: number,
  newsData: UpdateNewsInput,
): Promise<NewsOutput> {
  try {
    return await db.transaction(async (tx) => {
      // Check if news exists
      const existingNews = await tx
        .select()
        .from(news)
        .where(eq(news.id, id))
        .limit(1);

      if (!existingNews.length) {
        throw new AppError("News item not found", 404);
      }

      // If changing status to published, ensure publish_date
      let publishDate = newsData.publish_date;
      if (newsData.status === "published" && !existingNews[0].publish_date) {
        publishDate = new Date();
      }

      // Update news item
      await tx
        .update(news)
        .set({
          ...newsData,
          publish_date: publishDate,
          updated_at: new Date(),
        })
        .where(eq(news.id, id));

      // Update tags if provided
      if (newsData.tags !== undefined) {
        // Delete existing associations
        await tx.delete(news_to_tags).where(eq(news_to_tags.news_id, id));

        // If there are new tags, add them
        if (newsData.tags.length > 0) {
          // Verify all tags exist
          const existingTags = await tx
            .select({ id: news_tags.id })
            .from(news_tags)
            .where(inArray(news_tags.id, newsData.tags));

          if (existingTags.length !== newsData.tags.length) {
            throw new AppError("One or more tags do not exist", 400);
          }

          // Create new tag associations
          const tagAssociations = newsData.tags.map((tagId) => ({
            news_id: id,
            tag_id: tagId,
          }));

          await tx.insert(news_to_tags).values(tagAssociations);
        }
      }

      // Get updated news with tags
      return await getNewsById(id);
    });
  } catch (error) {
    logger.error(`Error updating news: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update news item", 500);
  }
}

// Delete news
export async function deleteNews(id: number): Promise<boolean> {
  try {
    // Start transaction
    return await db.transaction(async (tx) => {
      // Check if news exists
      const existingNews = await tx
        .select()
        .from(news)
        .where(eq(news.id, id))
        .limit(1);

      if (!existingNews.length) {
        throw new AppError("News item not found", 404);
      }

      // Delete tag associations first (should cascade, but being explicit)
      await tx.delete(news_to_tags).where(eq(news_to_tags.news_id, id));

      // Delete the news item
      await tx.delete(news).where(eq(news.id, id));

      return true;
    });
  } catch (error) {
    logger.error(`Error deleting news: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete news item", 500);
  }
}

// List news with filtering and pagination
export async function listNews(
  filter: NewsFilter = {},
): Promise<{ news: NewsOutput[]; total: number }> {
  try {
    const {
      category,
      status,
      search,
      tags,
      limit = 20,
      offset = 0,
      sortBy = "created_at",
      sortDir = "desc",
    } = filter;

    // Build the where clause
    let whereClause = and();

    if (category && category !== "all") {
      whereClause = and(whereClause, eq(news.category, category));
    }

    if (status) {
      whereClause = and(whereClause, eq(news.status, status));
    }

    if (search) {
      whereClause = and(
        whereClause,
        or(
          ilike(news.title, `%${search}%`),
          ilike(news.content, `%${search}%`),
          ilike(news.key_lessons || "", `%${search}%`),
        ),
      );
    }

    // Count total results
    const countResults = await db
        .select({ count: sql`count(*)::int` })
        .from(news)
        .where(whereClause);

    const total = Number(countResults[0]?.count || 0);

    // Sort direction
    const sortFn = sortDir === "asc" ? asc : desc;

    // Get paginated results
    const validSortColumns = ['id', 'title', 'created_at', 'updated_at', 'publish_date', 'status', 'category'] as const;
    type ValidSortColumn = typeof validSortColumns[number];

// Ensure sortBy is a valid column
    const safeSort = validSortColumns.includes(sortBy as any)
        ? sortBy as ValidSortColumn
        : 'created_at';

    const newsResults = await db
        .select()
        .from(news)
        .where(whereClause)
        .orderBy(sortFn(news[safeSort]))
        .limit(limit)
        .offset(offset);

    // For each news item, get its tags
    const newsWithTags = await Promise.all(
      newsResults.map(async (newsItem) => {
        const tagResults = await db
          .select({
            id: news_tags.id,
            name: news_tags.name,
          })
          .from(news_to_tags)
          .innerJoin(news_tags, eq(news_to_tags.tag_id, news_tags.id))
          .where(eq(news_to_tags.news_id, newsItem.id));

        return {
          ...newsItem,
          tags: tagResults,
        };
      }),
    );

    // If tag filtering is needed
    if (tags && tags.length > 0) {
      const filteredNews: NewsOutput[] = newsWithTags.filter(
        (newsItem: NewsOutput) =>
          tags.every((tagId: number) =>
            newsItem.tags.some(
              (tag: { id: number; name: string }) => tag.id === tagId,
            ),
          ),
      );

      return {
        news: filteredNews,
        total: filteredNews.length, // Note: This is not accurate for pagination
      };
    }

    return {
      news: newsWithTags,
      total,
    };
  } catch (error) {
    logger.error("Error listing news", error);
    throw new AppError("Failed to list news items", 500);
  }
}

// Create a new tag
export async function createTag(
  name: string,
): Promise<{ id: number; name: string }> {
  try {
    // Check if tag already exists
    const existingTag = await db
      .select()
      .from(news_tags)
      .where(eq(news_tags.name, name))
      .limit(1);

    if (existingTag.length > 0) {
      return existingTag[0];
    }

    // Insert the tag
    const result = await db
      .insert(news_tags)
      .values({
        name,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    if (!result.length) {
      throw new AppError("Failed to create tag", 500);
    }

    return {
      id: result[0].id,
      name: result[0].name,
    };
  } catch (error) {
    logger.error("Error creating tag", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create tag", 500);
  }
}

// List all tags
export async function listTags(): Promise<Array<{ id: number; name: string }>> {
  try {
    const result = await db
      .select({
        id: news_tags.id,
        name: news_tags.name,
      })
      .from(news_tags);

    return result;
  } catch (error) {
    logger.error("Error listing tags", error);
    throw new AppError("Failed to list tags", 500);
  }
}

// Delete a tag
export async function deleteTag(id: number): Promise<boolean> {
  try {
    // Check if tag exists
    const existingTag = await db
      .select()
      .from(news_tags)
      .where(eq(news_tags.id, id))
      .limit(1);

    if (!existingTag.length) {
      throw new AppError("Tag not found", 404);
    }

    // Delete the tag (will cascade delete associations)
    await db.delete(news_tags).where(eq(news_tags.id, id));

    return true;
  } catch (error) {
    logger.error(`Error deleting tag: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete tag", 500);
  }
}

// Export the service functions
export const newsService = {
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
  listNews,
  createTag,
  listTags,
  deleteTag,
};

// Default export for the service object
export default newsService;
