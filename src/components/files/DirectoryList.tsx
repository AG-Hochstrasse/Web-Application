import React, { useEffect, useState } from "react";
import uploadFile from "../../utils/uploadFile";
import listFiles from "../../utils/listFiles";
import { Button, Heading, PageLayout, Spinner, Stack, Text } from "@primer/react";
import FileList, { FileObj } from "../../components/files/FileList";
import JSZip from "jszip";
import { supabase } from "../../services/supabaseClient";

/**
 * Downloads a directory from Supabase Storage as a zip file.
 */
export async function downloadDirectoryAsZip(bucketName: string, dirPath: string, zipName: string = "files.zip") {
  const { data: files, error } = await supabase.storage.from(bucketName).list(dirPath, { limit: 1000 });
  if (error) throw error;

  const zip = new JSZip();

  for (const file of files ?? []) {
    if (file.name && !file.metadata?.mimetype?.endsWith("directory")) {
      const filePath = `${dirPath}${file.name}`;
      const { data, error: downloadError } = await supabase.storage.from(bucketName).download(filePath);
      if (downloadError || !data) continue;
      zip.file(file.name, data);
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = zipName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

interface DirectoryListProps {
  bucketName: string;
  path?: string;
}

export default function DirectoryList({ bucketName, path }: DirectoryListProps) {
  // Remove all leading and trailing slashes
  const dirPath = path ? path.replace(/^\/+|\/+$/g, "") : "";
  
  const [result, setResult] = useState<{ id: string, fullPath: string } | null>()
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<FileObj[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  const update = async () => {
    setLoading(true)
    const files = await listFiles(bucketName, dirPath)
    if (files) {
      setFiles(files)
      setError(null)
    }
    else {
      setFiles([])
      setError("Error loading files")
    }
    setLoading(false)
  }

  useEffect(() => {
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, bucketName, dirPath])

  async function handleFile(file: File) {
    setUploading(true)
    setResult(await uploadFile(bucketName, `${dirPath}/${file.name}`, file))
    setUploading(false)
  }

  function dropHandler(ev: React.DragEvent) {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      Array.from(ev.dataTransfer.items).forEach((item) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) handleFile(file);
        }
      });
    } else {
      Array.from(ev.dataTransfer.files).forEach((file) => {
        handleFile(file);
      });
    }
  }

  function changeHandler(ev: React.ChangeEvent<HTMLInputElement>) {
    const files = ev.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        handleFile(file);
      });
    }
  }

  if (loading) {
    return (
      <Stack direction="horizontal" align="center">
        <Spinner />
        <Text>Loading...</Text>
      </Stack>
    );
  }

  return (
    <>
      <div
        onDrop={dropHandler}
        onDragOver={(ev) => ev.preventDefault()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <p>Drag and drop files here, or click to select files</p>
        <input
          type="file"
          onChange={changeHandler}
          multiple
          style={{ display: "none" }}
          id="fileInput"
          disabled={uploading}
        />
        <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
          <Button as="span" loading={uploading} disabled={uploading}>
            Select Files
          </Button>
        </label>
      </div>
      <br />
      <FileList
        bucket={bucketName}
        files={files.map(f => ({ ...f, fullPath: `${dirPath}/${f.name}`.replace(/^\/+|\/+$/g, "") }))}
        title={`${files.length} files`}
        update={update}
        downloadAll={() => downloadDirectoryAsZip(bucketName, dirPath, "files.zip")}
      />
    </>
  );
}