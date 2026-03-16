import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Star, GraduationCap, BookOpen } from 'lucide-react';
import { useProfessorSearch } from '@/hooks/useProfessorSearch';
import Link from 'next/link';

export default function BuscarPage() {
  const [query, setQuery] = useState('');
  const { professors, loading, search } = useProfessorSearch();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      search({ query });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, search]);

  return (
    <>
      <Head>
        <title>Buscar Profesores | UTN FRRO</title>
      </Head>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="font-syne text-4xl font-bold mb-4">Encuentra a tu Profesor</h1>
            <p className="text-[#7A8BA6]">Busca por nombre, materia o departamento.</p>
          </header>

          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#7A8BA6]" />
            </div>
            <input
              type="text"
              placeholder="Ej: Ricardo Pérez, Análisis Matemático..."
              className="w-full bg-[#1A1D26] border border-[#2A2F3D] rounded-2xl py-4 pl-12 pr-4 text-[#E8EDFF] focus:outline-none focus:ring-2 focus:ring-[#4F8EF7] transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F8EF7]"></div>
              </div>
            ) : professors.length > 0 ? (
              professors.map((prof, index) => (
                <motion.div
                  key={prof.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/profesor/${prof.slug}`}>
                    <div className="bg-[#1A1D26] border border-[#2A2F3D] p-6 rounded-2xl hover:border-[#4F8EF7] transition-all group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#2A2F3D] rounded-xl flex items-center justify-center text-[#4F8EF7] group-hover:bg-[#4F8EF7] group-hover:text-white transition-colors">
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-[#4F8EF7] transition-colors">{prof.full_name}</h3>
                            <div className="flex items-center gap-3 text-sm text-[#7A8BA6] mt-1">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {prof.faculty}
                              </span>
                              {prof.total_ratings > 0 && (
                                <span className="flex items-center gap-1 text-yellow-500">
                                  <Star className="w-3 h-3 fill-current" />
                                  {prof.avg_overall.toFixed(1)} ({prof.total_ratings})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {prof.subjects?.slice(0, 2).map((sub: string) => (
                            <span key={sub} className="text-[10px] uppercase tracking-wider font-bold bg-[#2A2F3D] px-2 py-1 rounded text-[#7A8BA6]">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-[#7A8BA6]">
                No se encontraron profesores que coincidan con tu búsqueda.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
