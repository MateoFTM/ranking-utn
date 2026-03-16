import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase/client';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Calendar, Award, BookOpen } from 'lucide-react';

interface ProfessorPageProps {
  professor: any;
}

export default function ProfessorProfile({ professor }: ProfessorPageProps) {
  if (!professor) return null;

  return (
    <div className="min-h-screen bg-[#0D0F14] pb-20">
      <Head>
        <title>{professor.full_name} | Ranking UTN</title>
      </Head>

      {/* Header del Perfil */}
      <div className="bg-[#161B25] border-b border-[#2A3347] pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#2A3347] shadow-2xl">
              <Image 
                src={professor.photo_url || `https://picsum.photos/seed/${professor.id}/320/320`}
                alt={professor.full_name}
                fill
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="font-syne text-4xl md:text-5xl font-bold text-[#E8EDFF]">
                  {professor.full_name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 bg-[#4F8EF7]/10 text-[#4F8EF7] px-4 py-2 rounded-full border border-[#4F8EF7]/20">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-jetbrains font-bold text-xl">{professor.avg_overall.toFixed(1)}</span>
                </div>
              </div>
              <p className="font-dm-sans text-xl text-[#7A8BA6] mb-6">
                {professor.department} • <span className="text-[#E8EDFF]">{professor.institution}</span>
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <button className="bg-[#4F8EF7] hover:bg-[#3b7add] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-[#4F8EF7]/20">
                  Evaluar a este profesor
                </button>
                <button className="bg-[#1E2535] border border-[#2A3347] text-[#E8EDFF] hover:bg-[#2A3347] font-bold py-3 px-8 rounded-xl transition-all">
                  Seguir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Columna Izquierda: Métricas */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-[#161B25] border border-[#2A3347] rounded-3xl p-8">
              <h3 className="font-syne text-lg font-bold text-[#E8EDFF] mb-8 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F7C94F]" /> Métricas Detalladas
              </h3>
              
              <div className="space-y-6">
                {[
                  { label: 'Calidad de Enseñanza', value: professor.avg_quality, color: 'bg-[#4F8EF7]' },
                  { label: 'Claridad en Explicación', value: professor.avg_clarity, color: 'bg-[#4CAF7D]' },
                  { label: 'Justicia en Evaluación', value: professor.avg_fairness, color: 'bg-[#F7C94F]' },
                  { label: 'Nivel de Dificultad', value: professor.avg_difficulty, color: 'bg-[#F75F5F]' },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#7A8BA6] font-medium">{metric.label}</span>
                      <span className="text-[#E8EDFF] font-bold font-jetbrains">{metric.value.toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-[#1E2535] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(metric.value / 5) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${metric.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-[#2A3347] flex items-center justify-between">
                <div>
                  <p className="text-[#7A8BA6] text-xs font-bold uppercase tracking-wider mb-1">Volverían a cursar</p>
                  <p className="text-3xl font-syne font-bold text-[#4CAF7D]">{professor.retake_percentage.toFixed(0)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[#7A8BA6] text-xs font-bold uppercase tracking-wider mb-1">Total Reseñas</p>
                  <p className="text-3xl font-syne font-bold text-[#E8EDFF]">{professor.total_ratings}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Columna Derecha: Reseñas */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-syne text-2xl font-bold text-[#E8EDFF] flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#4F8EF7]" /> Reseñas de Estudiantes
              </h3>
            </div>

            {/* Lista de Reseñas (Simulada por ahora) */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#161B25] border border-[#2A3347] rounded-3xl p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#1E2535] rounded-full flex items-center justify-center font-bold text-[#4F8EF7]">
                        E
                      </div>
                      <div>
                        <p className="text-[#E8EDFF] font-bold">Estudiante Anónimo</p>
                        <p className="text-[#7A8BA6] text-xs">Cursó en 2023 • <span className="text-[#4F8EF7]">Análisis Matemático I</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-[#4F8EF7]/10 text-[#4F8EF7] px-3 py-1 rounded-lg font-jetbrains font-bold">
                      <Star className="w-4 h-4 fill-current" /> 4.5
                    </div>
                  </div>
                  <h4 className="font-syne text-lg font-bold text-[#E8EDFF] mb-3">Excelente profesor, muy claro</h4>
                  <p className="text-[#7A8BA6] leading-relaxed mb-6">
                    Las clases son muy dinámicas y se nota que sabe mucho. Los parciales son acordes a lo que da en clase, nada de sorpresas. Recomiendo mucho cursar con él si quieres aprender de verdad.
                  </p>
                  <div className="flex items-center gap-6 pt-6 border-t border-[#2A3347]">
                    <button className="flex items-center gap-2 text-[#7A8BA6] hover:text-[#4CAF7D] transition-colors text-sm font-medium">
                      <ThumbsUp className="w-4 h-4" /> Útil (12)
                    </button>
                    <button className="flex items-center gap-2 text-[#7A8BA6] hover:text-[#F75F5F] transition-colors text-sm font-medium">
                      <ThumbsDown className="w-4 h-4" /> No útil (2)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // No pre-generamos ninguna por ahora
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Simulación de datos para el perfil
  const professor = {
    id: '1',
    full_name: 'Ing. Roberto García',
    slug: params?.slug as string,
    photo_url: null,
    department: 'Departamento de Sistemas',
    institution: 'UTN - Facultad Regional Buenos Aires',
    avg_overall: 4.7,
    avg_quality: 4.8,
    avg_clarity: 4.5,
    avg_fairness: 4.9,
    avg_difficulty: 3.2,
    retake_percentage: 92,
    total_ratings: 45
  };

  return {
    props: { professor },
    revalidate: 60
  };
};
