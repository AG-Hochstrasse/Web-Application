import React, { useEffect, useState } from "react";
import uploadFile from "../utils/uploadFile";
import listFiles from "../utils/listFiles";
import { Box, Button, Spinner, Stack, Text } from "@primer/react";
import FileList, { FileObj } from "../components/files/FileList";
import JSZip from "jszip";
import { supabase } from "../services/supabaseClient";

/**
 * Downloads a directory from Supabase Storage as a zip file.
 * @param bucketName The name of the bucket.
 * @param dirPath The path to the directory (with trailing slash).
 * @param zipName The name for the downloaded zip file.
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
export default function PersonFiles({ id }: { id: string }) {
  const [result, setResult] = useState<{ id: string, fullPath: string } | null>()
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<FileObj[]>([])

  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  const update = async () => {
    setLoading(true)
    const files = await listFiles("people", id)

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
  }, [result])

  async function handleFile(file: File) {
    setUploading(true)
    setResult(await uploadFile("people", `${id}/${file.name}`, file))
    setUploading(false)
  }

  function dropHandler(ev: React.DragEvent) {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      Array.from(ev.dataTransfer.items).forEach((item) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) handleFile(file);
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
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
        onDragOver={(ev) => ev.preventDefault()} // Prevent default to allow drop
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
        files={files.map(f => ({ ...f, fullPath: `${id}/${f.name}` }))}
        title={`${files.length} files`}
        update={update}
        downloadAll={() => downloadDirectoryAsZip("people", `${id}/`, `${id}.zip`)}
      />
    </>
  );
}