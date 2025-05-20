import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const { businessName, niche, colors, imageUrl } = req.body;
    
    if (!businessName || !niche || !colors || !imageUrl) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const userId = parseInt(session.user.id);
    
    const result = await pool.query(
      'INSERT INTO logos (user_id, business_name, niche, colors, image_url, edited) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [userId, businessName, niche, colors, imageUrl, false]
    );
    
    return res.status(201).json({ 
      message: 'Logo saved successfully', 
      logoId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error saving logo:', error);
    return res.status(500).json({ message: 'Error saving logo' });
  }
}