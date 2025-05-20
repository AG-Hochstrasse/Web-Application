import React, { useEffect, useState } from "react";
import uploadFile from "../utils/uploadFile";
import listFiles from "../utils/listFiles";
import { Text } from "@primer/react";
import FileList, { FileObj } from "../components/files/FileList";

export default function PersonFiles({ id }: { id: string }) {
  const [result, setResult] = useState<{ id: string, fullPath: string } | null>()
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<FileObj[]>([])

  const update = async () => {
    const files = await listFiles("people", id)

    if (files) {
      setFiles(files)
      setError(null)
    }
    else {
      setFiles([])
      setError("Error loading files")
    }
  }

  useEffect(() => {
    update()
  }, [result])

  async function handleFile(file: File) {
    setResult(await uploadFile("people", `${id}/${file.name}`, file))
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
        />
        <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
          Select Files
        </label>
      </div>
      <FileList files={files.map(f => ({ ...f, fullPath: `${id}/${f.name}` }))} update={update} />
    </>
  );
}