import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Star, Users, BookOpen, ChevronRight } from 'lucide-react';

interface ProfessorCardProps {
  professor: {
    id: string;
    full_name: string;
    slug: string;
    photo_url: string | null;
    department: string;
    institution: string;
    avg_overall: number;
    total_ratings: number;
    retake_percentage: number;
  };
}

export default function ProfessorCard({ professor }: ProfessorCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group relative bg-[#161B25] border border-[#2A3347] rounded-2xl p-5 transition-all hover:border-[#4F8EF7]/50 hover:shadow-[0_0_20px_rgba(79,142,247,0.1)]"
    >
      <Link href={`/profesor/${professor.slug}`} className="absolute inset-0 z-10" />
      
      <div className="flex items-start gap-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#2A3347] group-hover:border-[#4F8EF7] transition-colors">
          <Image 
            src={professor.photo_url || `https://picsum.photos/seed/${professor.id}/160/160`}
            alt={professor.full_name}
            fill
            sizes="64px"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-syne font-bold text-[#E8EDFF] text-lg truncate mb-1">
            {professor.full_name}
          </h3>
          <p className="text-[#7A8BA6] text-xs font-medium truncate uppercase tracking-wider">
            {professor.department}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 bg-[#4F8EF7]/10 text-[#4F8EF7] px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-jetbrains font-bold text-sm">{professor.avg_overall.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#1E2535] rounded-xl p-3">
          <div className="flex items-center gap-2 text-[#7A8BA6] mb-1">
            <Users className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Reseñas</span>
          </div>
          <p className="font-jetbrains text-[#E8EDFF] font-bold">{professor.total_ratings}</p>
        </div>
        <div className="bg-[#1E2535] rounded-xl p-3">
          <div className="flex items-center gap-2 text-[#7A8BA6] mb-1">
            <BookOpen className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Volvería</span>
          </div>
          <p className="font-jetbrains text-[#E8EDFF] font-bold">{professor.retake_percentage.toFixed(0)}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#2A3347]">
        <span className="text-[#7A8BA6] text-[10px] font-bold uppercase tracking-widest">
          {professor.institution}
        </span>
        <ChevronRight className="w-4 h-4 text-[#4F8EF7] transform group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
