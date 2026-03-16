import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Professor } from './useProfessorSearch';

export interface Rating {
  id: string;
  score_quality: number;
  score_difficulty: number;
  score_clarity: number;
  score_fairness: number;
  would_retake: boolean;
  review_title: string;
  review_text: string;
  created_at: string;
  student_code: string;
}

export function useProfessorProfile(slug: string) {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Obtener datos del profesor desde la vista pública
        const { data: profData, error: profError } = await supabase
          .from('professor_public_view')
          .select('*')
          .eq('slug', slug)
          .single();

        if (profError) throw profError;
        setProfessor(profData);

        // Obtener reseñas desde la vista pública
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('rating_public_view')
          .select('*')
          .eq('professor_id', profData.id)
          .order('created_at', { ascending: false });

        if (ratingsError) throw ratingsError;
        setRatings(ratingsData || []);

      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  return { professor, ratings, loading, error };
}
