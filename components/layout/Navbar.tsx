import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { User, LogOut, Search, Menu, X, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChanged((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#2A3347] bg-[#0D0F14]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4F8EF7] rounded-lg flex items-center justify-center text-white font-bold">U</div>
          <span className="font-syne font-bold text-xl tracking-tight text-[#E8EDFF]">UTN<span className="text-[#4F8EF7]">FRRO</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/buscar" className="text-sm font-medium text-[#7A8BA6] hover:text-[#4F8EF7] transition-colors flex items-center gap-2">
            <Search className="w-4 h-4" /> Buscar
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-[#E8EDFF] hover:text-[#4F8EF7] transition-colors">
                <div className="w-8 h-8 bg-[#1E2535] rounded-full flex items-center justify-center border border-[#2A3347]">
                  <User className="w-4 h-4 text-[#4F8EF7]" />
                </div>
                {user.user_metadata?.username || user.email?.split('@')[0]}
              </Link>
              <button 
                onClick={handleLogout}
                className="text-[#7A8BA6] hover:text-[#F75F5F] transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-sm font-medium text-[#7A8BA6] hover:text-[#E8EDFF] transition-colors">
                Ingresar
              </Link>
              <Link href="/auth/registro" className="px-5 py-2 bg-[#4F8EF7] text-white text-sm font-bold rounded-full hover:bg-[#3b7add] transition-all shadow-lg shadow-[#4F8EF7]/20">
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-[#E8EDFF]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#161B25] border-b border-[#2A3347] p-4 space-y-4">
          <Link href="/buscar" className="block text-[#7A8BA6] py-2" onClick={() => setIsOpen(false)}>Buscar Profesores</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block text-[#E8EDFF] font-bold py-2 border-t border-[#2A3347] mt-2" onClick={() => setIsOpen(false)}>
                Mi Perfil ({user.email})
              </Link>
              <button onClick={handleLogout} className="block w-full text-left text-[#F75F5F] py-2">Cerrar Sesión</button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#2A3347]">
              <Link href="/auth/login" className="text-center py-2 text-[#7A8BA6]" onClick={() => setIsOpen(false)}>Ingresar</Link>
              <Link href="/auth/registro" className="text-center py-2 bg-[#4F8EF7] rounded-lg text-white font-bold" onClick={() => setIsOpen(false)}>Registrarse</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
