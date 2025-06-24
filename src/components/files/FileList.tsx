import React, { useState } from "react";
import { Banner, DataTable, Dialog, Table } from "@primer/react/experimental";
import { Text, RelativeTime, Link, Box, IconButton, Button, TextInput, FormControl } from "@primer/react";
import { DownloadIcon, FileZipIcon, PencilIcon, TrashIcon } from "@primer/octicons-react";
import { deleteFileOrFolder } from "../../utils/deleteFileOrFolder";
import { moveFile } from "../../utils/moveFile";
import { getFileAsDataUrl } from "../../utils/getFile";
import { supabase } from "../../services/supabaseClient";

export interface FileObj {
  name: string
  bucket_id: string
  owner: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
}

export interface LocatedFileObj extends FileObj {
  fullPath: string
}

export default function FileList({ bucket, files, title, update, downloadAll, ariaId }: { bucket: string, files: LocatedFileObj[], title?: string, update?: () => void, downloadAll?: () => Promise<void>, ariaId?: string }) {
  const [isDeletionDialogOpen, setIsDeletionDialogOpen] = useState(false)
  const deleteButtonRef = React.useRef<HTMLButtonElement>(null)

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const renameButtonRef = React.useRef<HTMLButtonElement>(null)
  const onDialogClose = React.useCallback(() => setIsDeletionDialogOpen(false), [])
  const [newFileName, setNewFileName] = useState<string>("")

  const [selectedFile, setSelectedFile] = useState<LocatedFileObj | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadingAll, setDownloadingAll] = useState(false)

  if (!files || files.length === 0) {
    return <Text>No files available.</Text>;
  }

  function downloadDataUrl(dataUrl: string, filename: string) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <>
      {error && <Banner variant="critical">
        <Banner.Title>Error</Banner.Title>
        <Text>{error}</Text>
      </Banner>}
      <Table.Container>
        {title && <Table.Title id={ariaId ?? "files"}>{title}</Table.Title>}
        <Table.Actions>
          {downloadAll && <IconButton
            aria-label="Download all files as zip"
            icon={FileZipIcon}
            variant="invisible"
            onClick={async () => { setDownloadingAll(true); await downloadAll(); setDownloadingAll(false) }}
            loading={downloadingAll}
          />}
        </Table.Actions>
        <DataTable
          aria-labelledby="files"
          aria-describedby="uploaded files"
          data={files}
          columns={[
            {
              rowHeader: true,
              header: () => <Text>Name</Text>,
              field: "name",
              renderCell: (file) => (
                <Link
                  onClick={async (e) => {
                    e.preventDefault();
                    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(file.fullPath, 60); // 60 seconds
                    if (error) {
                      setError(String(error));
                      return;
                    }
                    window.open(data.signedUrl, "_blank");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {file.name}
                </Link>
              ),
            },
            {
              id: "actions",
              header: () => (<Box
                sx={{
                  clipPath: 'inset(50%)',
                  height: '1px',
                  overflow: 'hidden',
                  position: 'absolute',
                  whiteSpace: 'nowrap',
                  width: '1px',
                }}
              >
                Actions
              </Box>),
              renderCell: row => {
                return <>
                  <IconButton
                    loading={selectedFile === row && downloading}
                    aria-label={`Download: ${row.name}`}
                    icon={DownloadIcon}
                    variant="invisible"
                    onClick={async () => {
                      setSelectedFile(row)
                      setDownloading(true)
                      downloadDataUrl(await getFileAsDataUrl(bucket, row.fullPath), row.name)
                      setDownloading(false)
                    }}
                  />
                  <IconButton
                    ref={deleteButtonRef}
                    aria-label={`Delete: ${row.name}`}
                    icon={TrashIcon}
                    variant="invisible"
                    onClick={() => { setSelectedFile(row); setIsDeletionDialogOpen(!isDeletionDialogOpen) }}
                  />
                  <IconButton
                    ref={renameButtonRef}
                    aria-label={`Rename: ${row.name}`}
                    icon={PencilIcon}
                    variant="invisible"
                    onClick={() => { setSelectedFile(row); setIsRenameDialogOpen(!isRenameDialogOpen) }}
                  />
                </>
              }

            }
          ]}
        />
      </Table.Container>
      {/* @ts-ignore */}
      {isDeletionDialogOpen && selectedFile && <Dialog title="Confirm deletion" onClose={onDialogClose} returnFocusRef={deleteButtonRef}>
        <Box p={3}>
          Are you sure you want to delete <b>{selectedFile.name}</b>? This action cannot be undone.
        </Box>
        <Dialog.Footer p={-3}>
          <Button variant="danger" onClick={async () => {
            try {
              if (await deleteFileOrFolder(bucket, selectedFile.fullPath)) {
                setError(null)
                update?.()
              }
            }
            catch (e) {
              setError(`${e}`)
            }
            finally {
              setIsDeletionDialogOpen(false)
            }
          }}>
            Delete
          </Button>
        </Dialog.Footer>
      </Dialog>}
      {isRenameDialogOpen && selectedFile && <Dialog title="Rename file" onClose={() => setIsRenameDialogOpen(false)} returnFocusRef={renameButtonRef}>
        <p>Enter the new name for <b>{selectedFile.name}</b>:</p>
        <FormControl sx={{ mb: 3 }}>
          <TextInput
            placeholder="New name"
            onChange={(e) => {
              setNewFileName(e.target.value)
            }}
            validationStatus={/[\\\/:*?"<>|]/.test(newFileName) ? "error" : undefined}
          />
          {/[\\\/:*?"<>|]/.test(newFileName) && <FormControl.Validation variant="error">
            The new name may not contain any of the following characters: \ / : * ? " {"< >"} |
          </FormControl.Validation>}
        </FormControl>
        <Dialog.Footer>
          <Button variant="primary" disabled={newFileName === selectedFile.name || newFileName === "" || /[\\\/:*?"<>|]/.test(newFileName)} onClick={async () => {
            try {
              if (await moveFile(bucket, selectedFile.fullPath, selectedFile.fullPath.replace(selectedFile.name, newFileName))) {
                setError(null)
                update?.()
              }
            }
            catch (e) {
              setError(`${e}`)
            }
            finally {
              setIsRenameDialogOpen(false)
              setNewFileName("")
            }
          }}>
            Rename
          </Button>
        </Dialog.Footer>
      </Dialog>}
    </>
  );
};