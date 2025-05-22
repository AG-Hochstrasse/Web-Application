import { supabase } from '../services/supabaseClient';

/**
 * Renames a file in a Supabase storage bucket by moving it to a new path.
 * @param bucketName The name of the storage bucket.
 * @param fromPath The current path of the file.
 * @param toPath The new path (including new filename).
 * @returns Promise with the result of the operation.
 */
export async function moveFile(bucketName: string, fromPath: string, toPath: string) {
  // Supabase does not support direct rename, so we move the file
  const { data, error } = await supabase.storage.from(bucketName).move(fromPath, toPath);
  if (error) {
    throw error;
  }
  return data;
}