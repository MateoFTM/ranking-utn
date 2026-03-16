import { createClient } from '@supabase/supabase-js';

// Este cliente usa la Service Role Key, lo que significa que TIENE PRIVILEGIOS DE ADMIN.
// NUNCA debe ser expuesto al frontend (navegador). Solo debe usarse en getServerSideProps o API Routes.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
