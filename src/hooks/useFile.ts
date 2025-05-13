import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient'
import { setEnvironmentData } from 'worker_threads';

export async function useFile(bucket: string, path: string): Promise<{ error: string | null, url: string | null } | null> {
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error: databaseError } = await supabase
        .storage
        .from(bucket)
        .download(path);

      if (databaseError) {
        console.error('Error downloading file:', databaseError);
        setError(databaseError.message)
        return
      }

      if (!data) {
        setError("No data returned.")
        return
      }

      setUrl(URL.createObjectURL(data))
    }
    fetchData()
  }, [])

  return { url, error };
}