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
  
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM logos WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching logos:', error);
      return res.status(500).json({ message: 'Error fetching logos' });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}