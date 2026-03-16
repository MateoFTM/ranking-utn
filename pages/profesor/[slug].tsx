import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'motion/react';
import { Star, AlertCircle, ThumbsUp, Calendar, User, Book } from 'lucide-react';
import { useProfessorProfile } from '@/hooks/useProfessorProfile';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ProfesorPerfil() {
  const router = useRouter();
  const { slug } = router.query;
  const { professor, ratings, loading, error } = useProfessorProfile(slug as string);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F8EF7]"></div>
    </div>
  );

  if (error || !professor) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold">Profesor no encontrado</h1>
      <p className="text-[#7A8BA6] mt-2">Lo sentimos, no pudimos encontrar el perfil solicitado.</p>
      <button 
        onClick={() => router.push('/buscar')}
        className="mt-6 bg-[#4F8EF7] text-white px-6 py-2 rounded-full font-bold"
      >
        Volver a buscar
      </button>
    </div>
  );

  return (
    <>
      <Head>
        <title>{professor.full_name} | UTN FRRO</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar: Estadísticas */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#1A1D26] border border-[#2A2F3D] rounded-3xl p-8 sticky top-24"
            >
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-[#2A2F3D] rounded-3xl flex items-center justify-center text-[#4F8EF7] mx-auto mb-4">
                  <User className="w-12 h-12" />
                </div>
                <h1 className="font-syne text-2xl font-bold">{professor.full_name}</h1>
                <p className="text-[#7A8BA6] text-sm mt-1">{professor.faculty}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0D0F14] p-4 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-[#4F8EF7]">{professor.avg_overall.toFixed(1)}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#7A8BA6] font-bold mt-1">Promedio</div>
                </div>
                <div className="bg-[#0D0F14] p-4 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-white">{professor.total_ratings}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#7A8BA6] font-bold mt-1">Reseñas</div>
                </div>
              </div>

              <div className="space-y-4">
                <StatRow label="Calidad" value={professor.avg_overall} />
                <StatRow label="Claridad" value={professor.avg_overall} /> {/* Usando placeholder si no hay desglose en la vista */}
                <StatRow label="Dificultad" value={3.5} color="text-orange-400" />
              </div>

              <button className="w-full bg-[#4F8EF7] hover:bg-[#3b7add] text-white font-bold py-4 rounded-2xl mt-8 transition-all shadow-lg shadow-[#4F8EF7]/20">
                Evaluar Profesor
              </button>
            </motion.div>
          </div>

          {/* Main: Reseñas */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-syne text-2xl font-bold">Reseñas de Estudiantes</h2>
              <div className="flex gap-2">
                <span className="bg-[#1A1D26] px-4 py-2 rounded-full text-xs font-bold border border-[#2A2F3D]">Más Recientes</span>
              </div>
            </div>

            <div className="space-y-6">
              {ratings.length > 0 ? (
                ratings.map((rating, index) => (
                  <motion.div
                    key={rating.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#1A1D26] border border-[#2A2F3D] p-8 rounded-3xl"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2A2F3D] rounded-full flex items-center justify-center text-xs font-bold text-[#7A8BA6]">
                          {rating.student_code.slice(-2)}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{rating.student_code}</div>
                          <div className="text-[10px] text-[#7A8BA6] uppercase tracking-wider">
                            {format(new Date(rating.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold">
                        <Star className="w-4 h-4 fill-current" />
                        {rating.score_quality}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-3">{rating.review_title}</h3>
                    <p className="text-[#7A8BA6] leading-relaxed mb-6">
                      {rating.review_text}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-6 border-t border-[#2A2F3D]">
                      <Badge label="Dificultad" value={rating.score_difficulty} />
                      <Badge label="Claridad" value={rating.score_clarity} />
                      <Badge label="Justicia" value={rating.score_fairness} />
                      {rating.would_retake && (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-3 py-1 rounded-full">
                          <ThumbsUp className="w-3 h-3" /> Volvería a cursar
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-[#1A1D26] border border-[#2A2F3D] p-12 rounded-3xl text-center text-[#7A8BA6]">
                  Aún no hay reseñas para este profesor. ¡Sé el primero en calificar!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatRow({ label, value, color = "text-[#4F8EF7]" }: { label: string, value: number, color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#7A8BA6]">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 bg-[#0D0F14] rounded-full overflow-hidden">
          <div 
            className={`h-full bg-current ${color}`} 
            style={{ width: `${(value / 5) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-bold ${color}`}>{value.toFixed(1)}</span>
      </div>
    </div>
  );
}

function Badge({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
      <span className="text-[#7A8BA6]">{label}:</span>
      <span className="text-white">{value}/5</span>
    </div>
  );
}
