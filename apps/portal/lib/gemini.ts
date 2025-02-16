import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function generateSEOTitle(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Create a single, highly engaging SEO title for this article. The title should:
- Be between 50-60 characters
- Include the main keyword
- Be compelling and clear
- Use active voice
- Avoid clickbait

Content: ${content}

Return only the title, nothing else.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating SEO title:', error);
    throw error;
  }
}

export async function generateSEODescription(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Generate a SEO-optimized meta description for this article content. Make it compelling and informative in 150-160 characters. Content: ${content}`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating SEO description:', error);
    throw error;
  }
}

export async function generateExcerpt(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Create a concise excerpt/summary for this article content in 200-250 characters. Content: ${content}`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating excerpt:', error);
    throw error;
  }
} 