import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import openai from '@/lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { businessName, niche, colors } = req.body;
    
    if (!businessName || !niche || !colors) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-api-key') {
      console.error('OpenAI API key is not set properly');
      // Return placeholder images instead of failing completely
      return res.status(200).json({
        imageUrls: [
          'https://placehold.co/1024x1024/EEE/31343C?font=montserrat&text=Sample+Logo',
          'https://placehold.co/1024x1024/EEEEEE/31343C?font=montserrat&text=Demo+Logo'
        ],
        warning: 'Using placeholder images. Set a valid OpenAI API key to generate real logos.'
      });
    }
    
    // Create prompt for DALL-E
    const prompt = `Create a professional logo for a ${niche} business named "${businessName}". 
      The logo should use ${colors} colors. 
      Create a minimalist, modern design with a clean look. 
      The logo should be centered on a transparent background.`;
    
    console.log('Sending request to OpenAI with prompt:', prompt);
    
    try {
      // Generate images using OpenAI DALL-E
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      });
      
      console.log('OpenAI response received:', JSON.stringify(response.data));
      
      const imageUrl = response.data[0].url;
      
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }
      
      // For demonstration purposes, generate multiple results
      // In production with DALL-E 3, you might make multiple API calls for different designs
      const simulatedUrls = [
        imageUrl,
        // You would make additional API calls here for real multiple images
        // For now, we'll just use the same image
        imageUrl
      ];
      
      return res.status(200).json({ imageUrls: simulatedUrls });
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Return placeholder images on OpenAI API error
      return res.status(200).json({
        imageUrls: [
          'https://placehold.co/1024x1024/EEE/31343C?font=montserrat&text=Sample+Logo',
          'https://placehold.co/1024x1024/EEEEEE/31343C?font=montserrat&text=Demo+Logo'
        ],
        warning: 'Using placeholder images due to API issues. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Error generating logos:', error);
    return res.status(500).json({ 
      message: 'Error generating logos', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}