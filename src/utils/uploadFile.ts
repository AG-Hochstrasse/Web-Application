import { supabase } from '../services/supabaseClient'

export default async function uploadFile(bucketName: string, filePath: string, file: File) {
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload(filePath, file);

  if (error) {

    alert('Error uploading file:'+error.message);
    return null;
  }

  console.log('File uploaded successfully:', data);

  return data;
}