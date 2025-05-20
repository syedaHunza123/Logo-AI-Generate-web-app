import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { imageUrl, format } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }
    
    if (format !== 'png' && format !== 'svg') {
      return res.status(400).json({ message: 'Format must be png or svg' });
    }
    
    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }
    
    const imageBuffer = await imageResponse.buffer();
    
    // In a real app, if format is SVG, you'd convert PNG to SVG here
    // For this demo, we'll just return the image as is
    
    // Set appropriate headers
    res.setHeader('Content-Type', format === 'svg' ? 'image/svg+xml' : 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=logo.${format}`);
    
    return res.send(imageBuffer);
  } catch (error) {
    console.error('Error downloading logo:', error);
    return res.status(500).json({ message: 'Error downloading logo' });
  }
}