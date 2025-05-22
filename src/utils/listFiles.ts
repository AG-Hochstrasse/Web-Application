import { supabase } from '../services/supabaseClient'

export default async function listFiles(bucketName: string, path: string) {
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .list(path, {
      // Optional: Set this to true to include the full path in the response
      // This is useful if you want to see the structure of the files
      limit: 100, // You can set a limit to the number of files returned
      offset: 0,  // You can set an offset for pagination
      sortBy: { column: 'name', order: 'asc' } // Optional: Sort files by name
    });

  if (error) {
    console.error('Error listing files:', error);
    throw new Error(error.message)
    return null;
  }

  console.log('Files in path:', data);
  return data;
}