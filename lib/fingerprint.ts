import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: ReturnType<typeof FingerprintJS.load> | null = null;

export const getFingerprint = async (): Promise<string> => {
  if (!fpPromise) fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId;
};

export const hashFingerprint = async (visitorId: string): Promise<string> => {
  const buffer = await crypto.subtle.digest(
    'SHA-256', new TextEncoder().encode(visitorId)
  );
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');
};
