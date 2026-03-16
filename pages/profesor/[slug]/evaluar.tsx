import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { useProfessorProfile } from '@/hooks/useProfessorProfile';
import { useSubmitRating } from '@/hooks/useSubmitRating';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { supabase } from '@/lib/supabase';

export default function EvaluarProfesor() {
  const router = useRouter();
  const { slug } = router.query;
  const { professor, loading: loadingProf } = useProfessorProfile(slug as string);
  const { submit, loading: submitting, error, success } = useSubmitRating();

  const [subjects, setSubjects] = useState<{id: string, name: string}[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [formData, setFormData] = useState({
    subject_id: '',
    score_quality: 3,
    score_clarity: 3,
    score_fairness: 3,
    score_difficulty: 3,
    would_retake: true,
    review_title: '',
    review_text: '',
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Verificar Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (!user && !loadingProf) {
        router.push(`/auth/login?redirect=/profesor/${slug}/evaluar`);
      }
    });
  }, [loadingProf, slug, router]);

  // Cargar Materias del Profesor
  useEffect(() => {
    if (professor?.id) {
      const fetchSubjects = async () => {
        const { data, error } = await supabase
          .from('professor_subjects')
          .select('subject_id, subjects(id, name)')
          .eq('professor_id', professor.id);
        
        if (!error && data) {
          // Extraer las materias del join
          const mappedSubjects = data.map((d: any) => d.subjects).filter(Boolean);
          setSubjects(mappedSubjects);
          
          // Si solo tiene una materia, auto-seleccionarla
          if (mappedSubjects.length === 1) {
            setFormData(prev => ({ ...prev, subject_id: mappedSubjects[0].id }));
          }
        }
        setLoadingSubjects(false);
      };
      fetchSubjects();
    }
  }, [professor?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      alert('Por favor, completa el captcha');
      return;
    }
    if (!formData.subject_id) {
      alert('Debes seleccionar una materia');
      return;
    }
    if (!professor) return;

    await submit({
      ...formData,
      professor_id: professor.id,
      captcha_token: captchaToken
    });
  };

  if (loadingProf || loadingSubjects) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#4F8EF7] w-8 h-8" /></div>;

  // MODIFICACIÓN 2: Bloquear si no hay materias
  if (!loadingSubjects && subjects.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-4">No es posible evaluar</h1>
        <p className="text-[#7A8BA6] max-w-md mb-8">
          Este profesor aún no tiene materias asignadas en el sistema. No es posible evaluarlo hasta que un administrador le asigne al menos una materia.
        </p>
        <button 
          onClick={() => router.push(`/profesor/${slug}`)}
          className="bg-[#4F8EF7] text-white px-8 py-3 rounded-full font-bold"
        >
          Volver al perfil
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-emerald-500/10 p-6 rounded-full mb-6">
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-4">¡Reseña publicada con éxito!</h1>
        <p className="text-[#7A8BA6] max-w-md mb-8">
          Tu evaluación ya está visible en el perfil del profesor. ¡Gracias por contribuir a la comunidad!
        </p>
        <button 
          onClick={() => router.push(`/profesor/${slug}`)}
          className="bg-[#4F8EF7] text-white px-8 py-3 rounded-full font-bold"
        >
          Ver reseña en el perfil
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Evaluar a {professor?.full_name} | UTN FRRO</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <header className="mb-10">
            <h1 className="font-syne text-3xl font-bold mb-2">Evaluar a {professor?.full_name}</h1>
            <p className="text-[#7A8BA6]">Comparte tu experiencia honesta para ayudar a otros estudiantes.</p>
          </header>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-2xl mb-8 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Materia */}
            <div className="bg-[#1A1D26] border border-[#2A2F3D] p-6 rounded-3xl">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#7A8BA6] mb-4">¿En qué materia lo cursaste?</label>
              
              {subjects.length === 1 ? (
                <div className="w-full bg-[#0D0F14] border border-[#2A2F3D] rounded-xl py-4 px-4 text-[#E8EDFF] opacity-80 flex items-center justify-between">
                  <span>{subjects[0].name}</span>
                  <span className="text-xs text-[#4F8EF7] font-bold bg-[#4F8EF7]/10 px-2 py-1 rounded">Única materia</span>
                </div>
              ) : (
                <select 
                  required
                  className="w-full bg-[#0D0F14] border border-[#2A2F3D] rounded-xl py-4 px-4 text-[#E8EDFF] outline-none focus:border-[#4F8EF7]"
                  value={formData.subject_id}
                  onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                >
                  <option value="">Selecciona una materia...</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Métricas */}
            <div className="bg-[#1A1D26] border border-[#2A2F3D] p-8 rounded-3xl space-y-8">
              <RatingSlider 
                label="Calidad General" 
                description="¿Qué tan buena fue la cursada en general?"
                value={formData.score_quality} 
                onChange={(v) => setFormData({...formData, score_quality: v})} 
              />
              <RatingSlider 
                label="Claridad" 
                description="¿Se entiende cuando explica los temas complejos?"
                value={formData.score_clarity} 
                onChange={(v) => setFormData({...formData, score_clarity: v})} 
              />
              <RatingSlider 
                label="Justicia" 
                description="¿Los exámenes son acordes a lo dado en clase?"
                value={formData.score_fairness} 
                onChange={(v) => setFormData({...formData, score_fairness: v})} 
              />
              <RatingSlider 
                label="Dificultad" 
                description="1: Muy fácil | 5: Imposible"
                value={formData.score_difficulty} 
                onChange={(v) => setFormData({...formData, score_difficulty: v})} 
                color="bg-orange-500"
              />
            </div>

            {/* Texto */}
            <div className="bg-[#1A1D26] border border-[#2A2F3D] p-8 rounded-3xl space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#7A8BA6] mb-3">Título de la reseña</label>
                <input 
                  required
                  type="text"
                  placeholder="Ej: Excelente profesor, muy claro"
                  className="w-full bg-[#0D0F14] border border-[#2A2F3D] rounded-xl py-3 px-4 text-[#E8EDFF] outline-none focus:border-[#4F8EF7]"
                  value={formData.review_title}
                  onChange={(e) => setFormData({...formData, review_title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#7A8BA6] mb-3">Tu comentario</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Cuéntanos más detalles sobre su forma de dar clase, los parciales, etc..."
                  className="w-full bg-[#0D0F14] border border-[#2A2F3D] rounded-xl py-3 px-4 text-[#E8EDFF] outline-none focus:border-[#4F8EF7] resize-none"
                  value={formData.review_text}
                  onChange={(e) => setFormData({...formData, review_text: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="retake"
                  className="w-5 h-5 rounded bg-[#0D0F14] border-[#2A2F3D] text-[#4F8EF7] focus:ring-0"
                  checked={formData.would_retake}
                  onChange={(e) => setFormData({...formData, would_retake: e.target.checked})}
                />
                <label htmlFor="retake" className="text-sm text-[#E8EDFF]">¿Volverías a cursar con este profesor?</label>
              </div>
            </div>

            {/* Captcha y Submit */}
            <div className="flex flex-col items-center gap-6">
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
                onVerify={(token) => setCaptchaToken(token)}
                theme="dark"
              />
              
              <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-3 w-full">
                <Info className="w-5 h-5 text-[#4F8EF7] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#7A8BA6] leading-relaxed">
                  Tu reseña será publicada inmediatamente de forma anónima. Tu cuenta quedará vinculada internamente para evitar spam. 
                  Por favor, sé respetuoso y constructivo.
                </p>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-[#4F8EF7] hover:bg-[#3b7add] disabled:opacity-50 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-[#4F8EF7]/20 flex items-center justify-center gap-3"
              >
                {submitting ? <Loader2 className="animate-spin" /> : 'Publicar Evaluación'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function RatingSlider({ label, description, value, onChange, color = "bg-[#4F8EF7]" }: { label: string, description: string, value: number, onChange: (v: number) => void, color?: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="font-bold text-[#E8EDFF]">{label}</h4>
          <p className="text-[10px] text-[#7A8BA6] uppercase tracking-wider">{description}</p>
        </div>
        <span className={`text-2xl font-bold ${color.replace('bg-', 'text-')}`}>{value}</span>
      </div>
      <input 
        type="range" 
        min="1" 
        max="5" 
        step="1"
        className="w-full h-2 bg-[#0D0F14] rounded-lg appearance-none cursor-pointer accent-[#4F8EF7]"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </div>
  );
}
