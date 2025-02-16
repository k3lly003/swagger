"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, X } from "lucide-react";
import Container from "@/components/layout/container";
import axios from 'axios';

// Define the MediaItem type
interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'other';
  cover?: boolean;
  order?: number;
  thumbnailUrl?: string;
}

// Create an axios instance with retry configuration
const axiosInstance = axios.create({
  timeout: 10000,
});

// Add a retry interceptor
axiosInstance.interceptors.response.use(undefined, async (err) => {
  const { config, response } = err;

  if ((response && response.status === 429) || !response) {
    const maxRetries = 3;
    config.retryCount = config.retryCount || 0;

    if (config.retryCount < maxRetries) {
      config.retryCount += 1;

      const delay = Math.pow(2, config.retryCount) * 1000;
      console.log(`Retrying request (${config.retryCount}/${maxRetries}) after ${delay}ms...`);

      await new Promise(resolve => setTimeout(resolve, delay));

      return axiosInstance(config);
    }
  }

  return Promise.reject(err);
});

// Throttled axios instance for API requests
interface ThrottledAxios {
  get: (url: string, config?: Record<string, any>) => Promise<any>;
}

const throttledAxios: ThrottledAxios = {
  get: (url, config = {}) => {
    return axiosInstance.get(url, config);
  }
};

// Type definitions for page parameters
type PageProps = {
  params: {
    slug: string;
    locale: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

const NewsDetailsPage = async ({ params, searchParams }: PageProps) => {
  const { locale, slug } = params;


  // State for media gallery
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Helper function to process HTML content with sentence-aware word breaks
  const processContentWithWordBreaks = (htmlContent: string) => {
    // Check if the content is HTML or plain text
    const isHTML = /<[a-z][\s\S]*>/i.test(htmlContent);

    if (isHTML) {
      // Process paragraphs to add word breaks after complete sentences, monitoring word count
      return htmlContent.replace(
          /(<p>)(.*?)(<\/p>)/gs,
          (match, openTag, content, closeTag) => {
            // Split into sentences
            const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
            let processedContent = '';
            let wordCount = 0;
            let currentChunk = '';

            // Process content sentence by sentence, monitoring word count
            sentences.forEach((sentence: string) => {
              const trimmedSentence: string = sentence.trim();
              const sentenceWordCount: number = trimmedSentence.split(/\s+/).length;

              // If adding this sentence would exceed ~100 words and we already have content,
              // add a break before adding this sentence
              if (wordCount + sentenceWordCount > 100 && wordCount > 0) {
                processedContent += currentChunk + '<br /><br />';
                currentChunk = trimmedSentence;
                wordCount = sentenceWordCount;
              } else {
                // Otherwise, just add the sentence to the current chunk
                currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
                wordCount += sentenceWordCount;
              }
            });

            // Add any remaining content
            if (currentChunk) {
              processedContent += currentChunk;
            }

            // Add extra spacing between paragraphs
            return `${openTag}${processedContent}${closeTag}<div class="my-6"></div>`;
          }
      ).replace(
          /<h([1-6])>(.*?)<\/h\1>/g,
          (match, level, content) => `<h${level} class="mt-8 mb-4">${content}</h${level}>`
      );
    } else {
      // If it's not HTML, wrap it in appropriate tags and process
      const paragraphs = htmlContent.split(/\n\n|\r\n\r\n/);
      let processedHTML = '';

      paragraphs.forEach(paragraph => {
        if (paragraph.trim() === '') return;

        // Split into sentences
        const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
        let processedParagraph = '<p>';
        let wordCount = 0;
        let currentChunk = '';

        // Process content sentence by sentence, monitoring word count
        sentences.forEach(sentence => {
          const trimmedSentence = sentence.trim();
          const sentenceWordCount = trimmedSentence.split(/\s+/).length;

          // If adding this sentence would exceed ~100 words and we already have content,
          // add a break before adding this sentence
          if (wordCount + sentenceWordCount > 100 && wordCount > 0) {
            processedParagraph += currentChunk + '<br /><br />';
            currentChunk = trimmedSentence;
            wordCount = sentenceWordCount;
          } else {
            // Otherwise, just add the sentence to the current chunk
            currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
            wordCount += sentenceWordCount;
          }
        });

        // Add any remaining content
        if (currentChunk) {
          processedParagraph += currentChunk;
        }

        processedParagraph += '</p><div class="my-6"></div>';
        processedHTML += processedParagraph;
      });

      return processedHTML;
    }
  };

  // Helper function to process plain text with word breaks
  const processPlainTextWithWordBreaks = (text: string) => {
    const paragraphs = text.split('\n\n');

    return (
        <div>
          {paragraphs.map((paragraph, index) => {
            // Split paragraph into words
            const words = paragraph.trim().split(/\s+/);
            const chunks = [];

            // Create chunks of ~100 words
            for (let i = 0; i < words.length; i += 100) {
              chunks.push(words.slice(i, i + 100).join(' '));
            }

            return (
                <p key={index} className="text-lg leading-relaxed mb-6">
                  {chunks.map((chunk, chunkIndex) => (
                      <React.Fragment key={chunkIndex}>
                        {chunk}
                        {chunkIndex < chunks.length - 1 && <br />}
                      </React.Fragment>
                  ))}
                </p>
            );
          })}
        </div>
    );
  };

  interface Article {
    title: string;
    content?: string;
    description?: string;
    publish_date: string;
    tags?: { id: string; name: string }[];
    media?: Media;
    highlights?: string[];
  }

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);

  // Get API base URL - use environment variable or fallback
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

  // Format date
  interface FormatDateOptions {
    month: 'long';
    day: 'numeric';
    year: 'numeric';
  }

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const options: FormatDateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Fetch article details by slug
  useEffect(() => {
    const fetchArticleBySlug = async () => {
      try {
        setLoading(true);

        // In a real implementation, you'd have an endpoint that can fetch by slug
        // For now, we'll get all articles and filter by slug
        const response = await throttledAxios.get(`${API_BASE_URL}/news`);

        if (response.data && response.data.news) {
          const articles = response.data.news;

          // Find the article that matches the slug
          const foundArticle = articles.find((article: { title: any; }) =>
              generateSlug(article.title) === slug
          );

          if (foundArticle) {
            setArticle(foundArticle);

            // Get related articles (same tag)
            if (foundArticle.tags && foundArticle.tags.length > 0) {
              const mainTag = foundArticle.tags[0];
              interface Article {
                id: string;
                tags: Tag[];
              }

              interface Tag {
                id: string;
                name: string;
              }

              const related = articles.filter((a: Article) =>
                  a.id !== foundArticle.id &&
                  a.tags &&
                  a.tags.some((tag: Tag) => tag.id === mainTag.id)
              ).slice(0, 3); // Get up to 3 related articles

              setRelatedArticles(related);
            }

            setError(false);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching article details:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticleBySlug();
    }
  }, [slug, API_BASE_URL]);

  // Helper function to generate a slug
  const generateSlug = (title: string) => {
    if (!title) return '';
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
  };

  // Function to get the cover image from media items
  interface Article {
    media?: Media;
  }

  interface Media {
    items?: MediaItem[];
  }

  const getCoverImage = (article: Article): string | null => {
    try {
      // Check if media and items exist
      if (!article || !article.media?.items?.length) {
        return null;
      }

      // Find the cover image (the one with cover: true)
      const coverImage = article.media.items.find((mediaItem: MediaItem) =>
          mediaItem.cover === true && mediaItem.type === 'image'
      );

      // Return the cover image URL if found
      if (coverImage && coverImage.url) {
        return coverImage.url;
      }

      // Fallback to the first image if no cover image is specified
      const firstImage = article.media.items.find(mediaItem =>
          mediaItem.type === 'image'
      );

      if (firstImage && firstImage.url) {
        return firstImage.url;
      }

      return null;
    } catch (error) {
      console.error('Error getting cover image:', error);
      return null;
    }
  };

  // Function to get all media items except the cover
  interface ArticleWithMedia {
    media?: MediaWithItems;
  }

  interface MediaWithItems {
    items?: MediaItem[];
  }

  const getMediaItems = (article: ArticleWithMedia): MediaItem[] => {
    try {
      // Check if media and items exist
      if (!article || !article.media?.items?.length) {
        return [];
      }

      // Sort items by order property
      return [...article.media.items].sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error('Error getting media items:', error);
      return [];
    }
  };

  // Function to handle media item click
  const handleMediaClick = (mediaItem: MediaItem) => {
    setSelectedMedia(mediaItem);
    setIsGalleryOpen(true);
  };

  // Function to close the media gallery
  const closeGallery = () => {
    setIsGalleryOpen(false);
    setSelectedMedia(null);
  };

  // Related article card component
  interface RelatedArticle {
    id: string;
    title: string;
    publish_date: string;
    tags: { id: string; name: string }[];
  }

  const RelatedArticleCard = ({ item }: { item: RelatedArticle }) => {
    const itemSlug = generateSlug(item.title);
    const imageUrl = getCoverImage(item);

    return (
        <Link href={`/${locale}/newsroom/${itemSlug}`} className="block group">
          <div className="relative bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            {/* Image Container */}
            <div className="relative aspect-[16/10]">
              {imageUrl ? (
                  <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                  />
              ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
              )}

              {/* Tag badge */}
              {item.tags && item.tags.length > 0 && (
                  <div className="absolute bottom-2 left-2 px-3 py-1 bg-[#00A651] text-white rounded-full text-xs font-medium">
                    {item.tags && item.tags[0] ? item.tags[0].name : 'Unknown'}
                  </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(item.publish_date)}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                {item.title}
              </h3>
            </div>
          </div>
        </Link>
    );
  };

  // Media item thumbnail component
  const MediaThumbnail = ({ mediaItem, index }: { mediaItem: MediaItem; index: number }) => {
    return (
        <div
            className="cursor-pointer rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            onClick={() => handleMediaClick(mediaItem)}
        >
          {mediaItem.type === 'image' ? (
              <div className="aspect-[16/10] group">
                <img
                    src={mediaItem.url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
          ) : mediaItem.type === 'video' ? (
              <div className="relative aspect-[16/10] bg-black group">
                <img
                    src={mediaItem.thumbnailUrl || mediaItem.url}
                    alt={`Video ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00A651]">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                </div>
              </div>
          ) : (
              <div className="aspect-[16/10] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Unknown media type</span>
              </div>
          )}
        </div>
    );
  };

  // Media gallery modal
  const MediaGalleryModal = () => {
    if (!isGalleryOpen || !selectedMedia) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={closeGallery}>
          <div className="relative max-w-6xl w-full h-auto mx-auto" onClick={(e) => e.stopPropagation()}>
            <button
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                onClick={closeGallery}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {selectedMedia.type === 'image' ? (
                <img
                    src={selectedMedia.url}
                    alt="Media preview"
                    className="max-h-[85vh] max-w-full object-contain mx-auto"
                />
            ) : selectedMedia.type === 'video' ? (
                <video
                    src={selectedMedia.url}
                    controls
                    className="max-h-[85vh] max-w-full mx-auto bg-black"
                    poster={selectedMedia.thumbnailUrl}
                />
            ) : (
                <div className="bg-gray-200 p-10 rounded-lg text-center">
                  <p>Unsupported media type</p>
                </div>
            )}
          </div>
        </div>
    );
  };

  if (loading) {
    return (
        <main className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-16 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A651]"></div>
          </div>
        </main>
    );
  }

  if (error || !article) {
    return (
        <main className="bg-gray-50 min-h-screen">
          <Container className="py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h2>
              <p className="text-gray-600 mb-8">The article you're looking for may have been removed or doesn't exist.</p>
              <Link href={`/${locale}/newsroom`} className="inline-flex items-center px-6 py-3 bg-[#00A651] text-white rounded-md hover:bg-[#008f46] transition-colors">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Newsroom
              </Link>
            </div>
          </Container>
        </main>
    );
  }

  // Get the cover image for the main article
  const mainImageUrl = getCoverImage(article);

  // Get all media items
  const allMediaItems = getMediaItems(article);

  return (
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section with Image */}
        <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {mainImageUrl ? (
                <img
                    src={mainImageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-r from-[#004D40] to-[#00A651]"></div>
            )}
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>

          {/* Content */}
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-10 z-20">
            {/* Category tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags && article.tags.map(tag => (
                  <span
                      key={tag.id}
                      className="px-4 py-1 bg-[#FFB800] text-white rounded-full text-sm font-medium"
                  >
                {tag.name}
              </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl">
              {article.title}
            </h1>

            {/* Date */}
            <div className="flex items-center mt-4 text-white/80">
              <Calendar className="h-5 w-5 mr-2" />
              {formatDate(article.publish_date)}
            </div>
          </div>
        </section>

        {/* Article Content */}
        <Container className="py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content Column */}
            <div className="w-full lg:w-2/3">
              {/* Back to newsroom link */}
              <Link
                  href={`/${locale}/newsroom`}
                  className="inline-flex items-center text-[#00A651] hover:text-[#008f46] mb-6 transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Newsroom
              </Link>

              {/* Article content */}
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <div
                    className="prose prose-lg max-w-none prose-headings:mb-6 prose-headings:mt-8 prose-p:my-4 prose-p:leading-relaxed prose-img:my-8 prose-img:rounded-lg prose-hr:my-10"
                    dangerouslySetInnerHTML={{
                      __html: processContentWithWordBreaks(article.content || article.description || 'No content available for this article.')
                    }}
                />

                {/* Media Gallery */}
                {allMediaItems.length > 0 && (
                    <div className="mt-10">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Media Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {allMediaItems.map((mediaItem, index) => (
                            <MediaThumbnail key={mediaItem.id || index} mediaItem={mediaItem} index={index} />
                        ))}
                      </div>
                    </div>
                )}
              </div>

              {/* Share the article section - Optional */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Share this article</h3>
                <div className="flex gap-3">
                  <button className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-opacity-90 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </button>
                  <button className="p-2 bg-[#1DA1F2] text-white rounded-full hover:bg-opacity-90 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </button>
                  <button className="p-2 bg-[#0077B5] text-white rounded-full hover:bg-opacity-90 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-[#00A651] rounded-full mr-2"></span>
                      Related Articles
                    </h3>

                    <div className="space-y-4">
                      {relatedArticles.map(item => (
                          <RelatedArticleCard key={item.id} item={item} />
                      ))}
                    </div>

                    <div className="mt-6 text-center">
                      <Link
                          href={`/${locale}/newsroom`}
                          className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-[#00A651] border border-[#00A651] rounded-md hover:bg-[#00A651] hover:text-white transition-colors"
                      >
                        View All News
                      </Link>
                    </div>
                  </div>
              )}

              {/* Key Highlights - if available */}
              {article.highlights && (
                  <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-[#FFB800] rounded-full mr-2"></span>
                      Key Highlights
                    </h3>

                    <ul className="space-y-3">
                      {article.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <div className="min-w-5 h-5 rounded-full bg-[#FFB800] flex items-center justify-center text-white text-xs mr-3 mt-1">
                              {index + 1}
                            </div>
                            <p className="text-gray-700">{highlight}</p>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}
            </div>
          </div>
        </Container>

        {/* Media Gallery Modal */}
        <MediaGalleryModal />
      </main>
  );
};

export default NewsDetailsPage;