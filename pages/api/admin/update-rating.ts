import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Verificar autenticación y rol usando el cliente normal (con cookies)
    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 2. Verificar rol en la tabla profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'moderator')) {
      return res.status(403).json({ error: 'Forbidden: Requires admin or moderator role' });
    }

    // 3. Ejecutar la actualización con privilegios de administrador
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: 'Missing rating id or status' });
    }

    const { error } = await supabaseAdmin
      .from('ratings')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error updating rating status:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
