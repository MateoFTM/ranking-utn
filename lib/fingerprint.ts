import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: ReturnType<typeof FingerprintJS.load> | null = null;

export const getFingerprint = async (): Promise<string> => {
  try {
    if (!fpPromise) fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.warn('FingerprintJS failed to load (likely blocked by adblocker). Using fallback.', error);
    // Generar un ID de fallback basado en la sesión actual para no bloquear al usuario
    return 'fallback-' + Math.random().toString(36).substring(2, 15);
  }
};

export const hashFingerprint = async (visitorId: string): Promise<string> => {
  const buffer = await crypto.subtle.digest(
    'SHA-256', new TextEncoder().encode(visitorId)
  );
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');
};
