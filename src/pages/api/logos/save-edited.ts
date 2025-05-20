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
    const { logoId, imageUrl, edited } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }
    
    const userId = parseInt(session.user.id);
    
    if (logoId) {
      // Update existing logo
      const checkResult = await pool.query(
        'SELECT * FROM logos WHERE id = $1 AND user_id = $2',
        [logoId, userId]
      );
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: 'Logo not found' });
      }
      
      await pool.query(
        'UPDATE logos SET image_url = $1, edited = $2 WHERE id = $3 AND user_id = $4',
        [imageUrl, edited, logoId, userId]
      );
      
      return res.status(200).json({ message: 'Logo updated successfully' });
    } else {
      return res.status(400).json({ message: 'Logo ID is required for updating' });
    }
  } catch (error) {
    console.error('Error saving edited logo:', error);
    return res.status(500).json({ message: 'Error saving edited logo' });
  }
}