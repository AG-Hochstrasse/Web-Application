import { useEffect, useState } from 'react';
import listFiles from '../utils/listFiles';
import { FileObj } from '../components/files/FileList';

/**
 * useFiles - React hook to list files from a bucket and path using arping's listFiles.
 * @param bucket - The bucket name.
 * @param path - The path inside the bucket.
 * @returns An object with loading, error, and files.
 */

export function useFiles(bucket: string, path: string) {
    const [files, setFiles] = useState<FileObj[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        listFiles(bucket, path)
            .then((result: FileObj[] | null) => {
                if (!cancelled) {
                    if (result) {
                        setError(null);
                        setFiles(result);
                    }
                    else {
                        setError(new Error('Error loading files'));
                        setFiles([]);
                    }
                    setLoading(false);
                }
            })
            .catch((err: Error) => {
                if (!cancelled) {
                    setError(err);
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [bucket, path]);

    return { files, loading, error };
}