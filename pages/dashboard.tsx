import Head from 'next/head';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { User, BookOpen, Star, Clock, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }
      
      setUser(user);

      // Obtener las reseñas del usuario actual
      // Como el usuario es el dueño (user_id = auth.uid()), RLS le permite leerlas sin importar el status
      const { data: userRatings, error } = await supabase
        .from('ratings')
        .select(`
          *,
          professors ( full_name, slug ),
          subjects ( name )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && userRatings) {
        setRatings(userRatings);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#4F8EF7] w-8 h-8" /></div>;

  return (
    <>
      <Head>
        <title>Mi Perfil | UTN FRRO</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header del Perfil */}
          <div className="bg-[#1A1D26] border border-[#2A2F3D] rounded-3xl p-8 mb-8 flex items-center gap-6">
            <div className="w-20 h-20 bg-[#2A2F3D] rounded-2xl flex items-center justify-center text-[#4F8EF7]">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="font-syne text-2xl font-bold mb-1">{user?.user_metadata?.username || 'Estudiante'}</h1>
              <p className="text-[#7A8BA6]">{user?.email}</p>
            </div>
          </div>

          <h2 className="font-syne text-xl font-bold mb-6">Mis Reseñas ({ratings.length})</h2>

          {ratings.length === 0 ? (
            <div className="bg-[#1A1D26] border border-[#2A2F3D] rounded-3xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-[#2A2F3D] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Aún no has evaluado a ningún profesor</h3>
              <p className="text-[#7A8BA6] mb-6">Tus evaluaciones ayudan a otros estudiantes a tomar mejores decisiones.</p>
              <button 
                onClick={() => router.push('/buscar')}
                className="bg-[#4F8EF7] text-white px-6 py-2 rounded-full font-bold"
              >
                Buscar Profesores
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="bg-[#1A1D26] border border-[#2A2F3D] rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-[#E8EDFF]">
                        {rating.professors?.full_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-[#7A8BA6] mt-1">
                        <span className="bg-[#2A2F3D] px-2 py-0.5 rounded text-xs">{rating.subjects?.name}</span>
                        <span>•</span>
                        <span>{format(new Date(rating.created_at), "d 'de' MMMM, yyyy", { locale: es })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <Star className="w-4 h-4 fill-current" />
                        {rating.score_quality}
                      </div>
                      <StatusBadge status={rating.status} />
                    </div>
                  </div>
                  
                  <div className="bg-[#0D0F14] rounded-xl p-4 border border-[#2A2F3D]">
                    <h4 className="font-bold text-sm mb-1">{rating.review_title}</h4>
                    <p className="text-sm text-[#7A8BA6]">{rating.review_text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'approved':
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500"><CheckCircle className="w-3 h-3" /> Pública</span>;
    case 'pending':
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500"><Clock className="w-3 h-3" /> En Revisión</span>;
    case 'flagged':
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-500"><AlertTriangle className="w-3 h-3" /> Reportada</span>;
    case 'rejected':
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500"><XCircle className="w-3 h-3" /> Oculta</span>;
    default:
      return <span>{status}</span>;
  }
}
