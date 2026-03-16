import Head from 'next/head';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Search, Star, Shield, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Head>
        <title>UTN FRRO | Evaluación Docente</title>
        <meta name="description" content="La plataforma de reseñas de profesores de la UTN Rosario. Construida por estudiantes para estudiantes." />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#4F8EF7]/10 blur-[120px] rounded-full -z-10" />
          
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-[#4F8EF7]/10 text-[#4F8EF7] text-[10px] font-bold uppercase tracking-widest mb-6 border border-[#4F8EF7]/20">
                UTN Facultad Regional Rosario
              </span>
              <h1 className="font-syne text-[clamp(2.5rem,8vw,5rem)] font-bold leading-[0.9] tracking-tight mb-8">
                Transparencia <br />
                <span className="text-[#4F8EF7]">Académica Real.</span>
              </h1>
              <p className="font-dm-sans text-lg text-[#7A8BA6] max-w-2xl mx-auto mb-12 leading-relaxed">
                Califica a tus profesores, comparte tu experiencia y ayuda a miles de compañeros a elegir mejor su camino académico. 100% anónimo y seguro.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/buscar" className="w-full sm:w-auto bg-[#4F8EF7] hover:bg-[#3b7add] text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl shadow-[#4F8EF7]/30 flex items-center justify-center gap-2 group">
                  Empezar a buscar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/auth/registro" className="w-full sm:w-auto bg-[#1A1D26] border border-[#2A3347] text-[#E8EDFF] font-bold py-4 px-10 rounded-2xl hover:bg-[#232835] transition-all">
                  Crear mi cuenta
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats / Features */}
        <section className="py-24 bg-[#161B25]/50 border-y border-[#2A3347]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <FeatureCard 
                icon={<Search className="w-6 h-6 text-[#4F8EF7]" />}
                title="Búsqueda Inteligente"
                description="Encuentra docentes por nombre, materia o departamento en segundos."
              />
              <FeatureCard 
                icon={<Shield className="w-6 h-6 text-emerald-500" />}
                title="100% Anónimo"
                description="Tus reseñas son anónimas. Usamos tecnología de punta para proteger tu identidad."
              />
              <FeatureCard 
                icon={<Users className="w-6 h-6 text-purple-500" />}
                title="+200 Profesores"
                description="Base de datos completa de la UTN FRRO cargada con datos oficiales."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-[#1A1D26] to-[#0D0F14] border border-[#2A3347] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4F8EF7]/20 blur-[80px] rounded-full" />
              <h2 className="font-syne text-4xl md:text-5xl font-bold mb-6 relative z-10">¿Listo para contribuir?</h2>
              <p className="text-[#7A8BA6] text-lg max-w-xl mx-auto mb-10 relative z-10">
                Tu opinión importa. Ayúdanos a construir una facultad más transparente y justa para todos.
              </p>
              <Link href="/buscar" className="inline-flex items-center gap-2 bg-white text-black font-bold py-4 px-10 rounded-2xl hover:bg-slate-100 transition-all relative z-10">
                Calificar un profesor <Star className="w-4 h-4 fill-black" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 bg-[#1A1D26] border border-[#2A3347] rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-syne">{title}</h3>
      <p className="text-[#7A8BA6] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
