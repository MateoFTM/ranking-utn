import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase/client';
import { getFingerprint, hashFingerprint } from '@/lib/fingerprint';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

const schema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres').max(20, 'Máximo 20 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function Registro() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    if (!captchaToken) {
      setError('Por favor, completa el captcha');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const visitorId = await getFingerprint();
      const fpHash = await hashFingerprint(visitorId);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            fingerprint_hash: fpHash
          }
        }
      });

      if (authError) throw authError;

      router.push('/auth/verificar-email');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error durante el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0F14] p-4">
      <Head>
        <title>Registro | Ranking UTN</title>
      </Head>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#161B25] border border-[#2A3347] rounded-2xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="font-syne text-3xl font-bold text-[#E8EDFF] mb-2">Únete a la comunidad</h1>
          <p className="font-dm-sans text-[#7A8BA6]">Crea tu cuenta para empezar a evaluar</p>
        </div>

        {error && (
          <div className="bg-[#F75F5F]/10 border border-[#F75F5F] text-[#F75F5F] p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A8BA6] mb-2">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8BA6]" />
              <input 
                {...register('username')}
                type="text"
                className="w-full bg-[#1E2535] border border-[#2A3347] rounded-xl py-3 pl-11 pr-4 text-[#E8EDFF] focus:border-[#4F8EF7] outline-none transition-colors"
                placeholder="tu_usuario"
              />
            </div>
            {errors.username && <p className="text-[#F75F5F] text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A8BA6] mb-2">Email Institucional</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8BA6]" />
              <input 
                {...register('email')}
                type="email"
                className="w-full bg-[#1E2535] border border-[#2A3347] rounded-xl py-3 pl-11 pr-4 text-[#E8EDFF] focus:border-[#4F8EF7] outline-none transition-colors"
                placeholder="ejemplo@utn.edu.ar"
              />
            </div>
            {errors.email && <p className="text-[#F75F5F] text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A8BA6] mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8BA6]" />
              <input 
                {...register('password')}
                type="password"
                className="w-full bg-[#1E2535] border border-[#2A3347] rounded-xl py-3 pl-11 pr-4 text-[#E8EDFF] focus:border-[#4F8EF7] outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-[#F75F5F] text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A8BA6] mb-2">Confirmar Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8BA6]" />
              <input 
                {...register('confirmPassword')}
                type="password"
                className="w-full bg-[#1E2535] border border-[#2A3347] rounded-xl py-3 pl-11 pr-4 text-[#E8EDFF] focus:border-[#4F8EF7] outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-[#F75F5F] text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex justify-center py-2">
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
              onVerify={(token) => setCaptchaToken(token)}
              theme="dark"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F8EF7] hover:bg-[#3b7add] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-[#7A8BA6] text-sm mt-8">
          ¿Ya tienes cuenta? <Link href="/auth/login" className="text-[#4F8EF7] hover:underline">Inicia sesión</Link>
        </p>
      </motion.div>
    </div>
  );
}
