import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Professor {
  id: string;
  full_name: string;
  slug: string;
  faculty: string;
  institution: string;
  avg_overall: number;
  total_ratings: number;
  subjects?: string[];
}

interface SearchOptions {
  query?: string;
  faculty?: string;
  subject_id?: string;
  min_rating?: number;
  order_by?: string;
  limit?: number;
  offset?: number;
}

export function useProfessorSearch() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (options: SearchOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: searchError } = await supabase.rpc('search_professors', {
        p_query: options.query || '',
        p_faculty: options.faculty || null,
        p_subject_id: options.subject_id || null,
        p_min_rating: options.min_rating || 0,
        p_only_with_ratings: false,
        p_order_by: options.order_by || 'avg_overall',
        p_limit: options.limit || 20,
        p_offset: options.offset || 0
      });

      if (searchError) throw searchError;
      setProfessors(data || []);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { professors, loading, error, search };
}
