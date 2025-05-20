import { supabase } from '../services/supabaseClient';

/**
 * Deletes a file or folder from a Supabase storage bucket.
 * @param bucketName The name of the storage bucket.
 * @param path The path to the file or folder to delete.
 * @returns Promise with the result of the deletion.
 */
export async function deleteFileOrFolder(bucketName: string, path: string) {
  const { data, error } = await supabase.storage.from(bucketName).remove([path]);
  if (error) {
    throw error;
  }
  return data;
}