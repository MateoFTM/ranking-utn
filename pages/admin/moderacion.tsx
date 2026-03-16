import Head from 'next/head';
import { useState } from 'react';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, Fingerprint, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient(ctx);
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return { redirect: { destination: '/auth/login', permanent: false } };
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
  
  if (!profile || (profile.role !== 'admin' && profile.role !== 'moderator')) {
    return { redirect: { destination: '/', permanent: false } };
  }

  // Usamos supabaseAdmin para saltar el RLS y traer TODOS los campos (incluyendo ip_hash y fingerprint)
  const { data: ratings } = await supabaseAdmin
    .from('ratings')
    .select(`
      *,
      professors ( full_name, slug ),
      subjects ( name ),
      profiles ( email, role )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  return { 
    props: { 
      initialRatings: ratings || [],
      userRole: profile.role
    } 
  };
};

export default function ModeracionPanel({ initialRatings, userRole }: { initialRatings: any[], userRole: string }) {
  const [ratings, setRatings] = useState(initialRatings);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/update-rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      setRatings(ratings.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      alert('Hubo un error al actualizar el estado.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Panel de Moderación | UTN FRRO</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-syne text-3xl font-bold">Panel de Moderación</h1>
            <p className="text-[#7A8BA6]">Rol actual: <span className="uppercase font-bold text-purple-400">{userRole}</span></p>
          </div>
        </div>

        <div className="bg-[#1A1D26] border border-[#2A2F3D] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0D0F14] text-[#7A8BA6] uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-bold">Fecha / Autor</th>
                  <th className="px-6 py-4 font-bold">Profesor / Materia</th>
                  <th className="px-6 py-4 font-bold">Reseña</th>
                  <th className="px-6 py-4 font-bold">Trazabilidad</th>
                  <th className="px-6 py-4 font-bold">Estado</th>
                  <th className="px-6 py-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D]">
                {ratings.map((rating) => (
                  <tr key={rating.id} className="hover:bg-[#2A2F3D]/20 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-[#E8EDFF]">{format(new Date(rating.created_at), "dd MMM yyyy", { locale: es })}</div>
                      <div className="text-xs text-[#7A8BA6] mt-1">{rating.profiles?.email || 'Usuario Anónimo'}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-[#E8EDFF]">{rating.professors?.full_name}</div>
                      <div className="text-xs text-[#7A8BA6] mt-1 bg-[#2A2F3D] inline-block px-2 py-0.5 rounded">{rating.subjects?.name}</div>
                    </td>
                    <td className="px-6 py-4 align-top max-w-xs">
                      <div className="font-bold text-[#E8EDFF] mb-1">{rating.review_title}</div>
                      <div className="text-xs text-[#7A8BA6] line-clamp-3">{rating.review_text}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="space-y-2 text-[10px] font-mono text-[#7A8BA6]">
                        <div className="flex items-center gap-1" title="Device Fingerprint Hash">
                          <Fingerprint className="w-3 h-3" /> 
                          {rating.device_fingerprint_hash ? rating.device_fingerprint_hash.substring(0, 12) + '...' : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1" title="IP Hash">
                          <Globe className="w-3 h-3" /> 
                          {rating.ip_hash ? rating.ip_hash.substring(0, 12) + '...' : 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <StatusBadge status={rating.status} />
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        {rating.status !== 'approved' && (
                          <button 
                            disabled={updatingId === rating.id}
                            onClick={() => handleStatusChange(rating.id, 'approved')}
                            className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors"
                            title="Aprobar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {rating.status !== 'flagged' && (
                          <button 
                            disabled={updatingId === rating.id}
                            onClick={() => handleStatusChange(rating.id, 'flagged')}
                            className="p-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 rounded-lg transition-colors"
                            title="Marcar como sospechosa"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                        {rating.status !== 'rejected' && (
                          <button 
                            disabled={updatingId === rating.id}
                            onClick={() => handleStatusChange(rating.id, 'rejected')}
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Rechazar / Ocultar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'approved':
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500"><CheckCircle className="w-3 h-3" /> Aprobada</span>;
    case 'pending':
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500"><Clock className="w-3 h-3" /> Pendiente</span>;
    case 'flagged':
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500"><AlertTriangle className="w-3 h-3" /> Reportada</span>;
    case 'rejected':
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500"><XCircle className="w-3 h-3" /> Rechazada</span>;
    default:
      return <span>{status}</span>;
  }
}
