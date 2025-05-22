import { supabase } from '../services/supabaseClient';

/**
 * Downloads a file from Supabase Storage and returns its contents as a Data URL.
 * @param bucketName The name of the storage bucket.
 * @param path The path to the file in the bucket.
 * @returns Promise<string> Data URL of the file contents.
 */
export async function getFileAsDataUrl(bucketName: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(bucketName).download(path);
  if (error || !data) {
    throw error ?? new Error('File not found');
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to Data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(data);
  });
}