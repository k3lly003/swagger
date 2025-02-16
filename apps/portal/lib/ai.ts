import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export async function generateSEOTitle(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = `Generate a SEO-friendly title for this article content. The title should be concise (max 60 characters), engaging, and accurately reflect the main topic. Here's the content:\n\n${content}`
    
    const result = await model.generateContent(prompt)
    const response = result.response
    const title = response.text().trim()
    
    return title
  } catch (error) {
    console.error('Error generating title:', error)
    throw new Error('Failed to generate title')
  }
}

export async function generateExcerpt(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = `Generate a concise excerpt (max 160 characters) that summarizes the main points of this article content. Make it engaging and informative. Here's the content:\n\n${content}`
    
    const result = await model.generateContent(prompt)
    const response = result.response
    const excerpt = response.text().trim()
    
    return excerpt
  } catch (error) {
    console.error('Error generating excerpt:', error)
    throw new Error('Failed to generate excerpt')
  }
} 