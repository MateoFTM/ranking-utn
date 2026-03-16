import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'motion/react';
import { MailCheck } from 'lucide-react';

export default function VerificarEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0F14] p-4">
      <Head>
        <title>Verificar Email | Ranking UTN</title>
      </Head>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#161B25] border border-[#2A3347] rounded-2xl p-8 shadow-xl text-center"
      >
        <div className="w-20 h-20 bg-[#4F8EF7]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <MailCheck className="w-10 h-10 text-[#4F8EF7]" />
        </div>
        
        <h1 className="font-syne text-2xl font-bold text-[#E8EDFF] mb-4">¡Casi listo!</h1>
        <p className="font-dm-sans text-[#7A8BA6] mb-8">
          Hemos enviado un enlace de confirmación a tu correo electrónico. Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para activar tu cuenta.
        </p>

        <Link 
          href="/auth/login"
          className="inline-block w-full bg-[#1E2535] border border-[#2A3347] text-[#E8EDFF] hover:bg-[#2A3347] font-bold py-3 rounded-xl transition-all min-h-[44px]"
        >
          Ir al Login
        </Link>
      </motion.div>
    </div>
  );
}
