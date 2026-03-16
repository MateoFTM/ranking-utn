import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getFingerprint, hashFingerprint } from '@/lib/fingerprint';

interface RatingInput {
  professor_id: string;
  subject_id: string;
  score_quality: number;
  score_clarity: number;
  score_fairness: number;
  score_difficulty: number;
  would_retake: boolean;
  review_title: string;
  review_text: string;
  captcha_token: string;
}

export function useSubmitRating() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (input: RatingInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Obtener Fingerprint
      const visitorId = await getFingerprint();
      const fpHash = await hashFingerprint(visitorId);

      // 2. Enviar a Supabase
      const { error: submitError } = await supabase
        .from('ratings')
        .insert({
          professor_id: input.professor_id,
          subject_id: input.subject_id,
          score_quality: input.score_quality,
          score_clarity: input.score_clarity,
          score_fairness: input.score_fairness,
          score_difficulty: input.score_difficulty,
          would_retake: input.would_retake,
          review_title: input.review_title,
          review_text: input.review_text,
          device_fingerprint_hash: fpHash,
          status: 'approved', // MODIFICACIÓN 1: Aprobado por defecto
        });

      if (submitError) {
        if (submitError.code === '23505') {
          throw new Error('Ya has calificado a este profesor en esta materia.');
        }
        throw submitError;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Submit rating error:', err);
      setError(err.message || 'Error al enviar la reseña');
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, success };
}
