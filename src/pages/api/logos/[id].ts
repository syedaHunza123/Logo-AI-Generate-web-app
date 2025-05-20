import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const userId = parseInt(session.user.id);
  const logoId = parseInt(req.query.id as string);
  
  if (isNaN(logoId)) {
    return res.status(400).json({ message: 'Invalid logo ID' });
  }
  
  switch (req.method) {
    case 'GET':
      try {
        const result = await pool.query(
          'SELECT * FROM logos WHERE id = $1 AND user_id = $2',
          [logoId, userId]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Logo not found' });
        }
        
        return res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error fetching logo:', error);
        return res.status(500).json({ message: 'Error fetching logo' });
      }
      
    case 'DELETE':
      try {
        const result = await pool.query(
          'DELETE FROM logos WHERE id = $1 AND user_id = $2 RETURNING id',
          [logoId, userId]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Logo not found' });
        }
        
        return res.status(200).json({ message: 'Logo deleted' });
      } catch (error) {
        console.error('Error deleting logo:', error);
        return res.status(500).json({ message: 'Error deleting logo' });
      }
      
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}