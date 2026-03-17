import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase/client';
import { Mail, Lock, Loader2 } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    if (!captchaToken && process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY) {
      setError('Por favor, completa el captcha');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
        options: {
          captchaToken: captchaToken || undefined,
        }
      });

      if (authError) throw authError;

      const redirect = (router.query.redirect as string) || '/';
      router.push(redirect);
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Error de conexión. Verifica que las variables de entorno de Supabase estén configuradas correctamente.');
      } else {
        setError(err.message || 'Credenciales inválidas');
      }
      // Reset captcha on error
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
        setCaptchaToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0F14] p-4">
      <Head>
        <title>Login | Ranking UTN</title>
      </Head>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#161B25] border border-[#2A3347] rounded-2xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="font-syne text-3xl font-bold text-[#E8EDFF] mb-2">Bienvenido</h1>
          <p className="font-dm-sans text-[#7A8BA6]">Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <div className="bg-[#F75F5F]/10 border border-[#F75F5F] text-[#F75F5F] p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A8BA6] mb-2">Email</label>
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

          <div className="flex justify-center py-4">
            {process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ? (
              <HCaptcha
                ref={captchaRef}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                theme="dark"
              />
            ) : (
              <div className="text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                ⚠️ NEXT_PUBLIC_HCAPTCHA_SITE_KEY no está configurada. El login puede fallar si Supabase requiere CAPTCHA.
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F8EF7] hover:bg-[#3b7add] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center text-[#7A8BA6] text-sm mt-8">
          ¿No tienes cuenta? <Link href="/auth/registro" className="text-[#4F8EF7] hover:underline">Regístrate</Link>
        </p>
      </motion.div>
    </div>
  );
}
