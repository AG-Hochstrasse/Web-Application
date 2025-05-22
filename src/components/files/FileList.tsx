import React from "react";
import { Banner, DataTable, Dialog, Table } from "@primer/react/experimental";
import { Text, Link as URLLink, RelativeTime, Link, Box, IconButton, Button, TextInput, Spinner } from "@primer/react";
import { DownloadIcon, PencilIcon, TrashIcon } from "@primer/octicons-react";
import { deleteFileOrFolder } from "../../utils/deleteFileOrFolder";
import { rename } from "fs";
import { moveFile } from "../../utils/moveFile";
import { getFileAsDataUrl } from "../../utils/getFile";
import { Link as RouterLink } from "react-router-dom";
import { get } from "http";
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

export default function FileList({ files, update, fileLink }: { files: LocatedFileObj[], update?: () => void, fileLink: string }) {
  const [isDeletionDialogOpen, setIsDeletionDialogOpen] = React.useState(false)
  const deleteButtonRef = React.useRef<HTMLButtonElement>(null)

  const [isRenameDialogOpen, setIsRenameDialogOpen] = React.useState(false)
  const renameButtonRef = React.useRef<HTMLButtonElement>(null)
  const onDialogClose = React.useCallback(() => setIsDeletionDialogOpen(false), [])
  const [newFileName, setNewFileName] = React.useState<string>("")

  const [selectedFile, setSelectedFile] = React.useState<LocatedFileObj | null>(null)

  const [error, setError] = React.useState<string | null>(null)
  const [downloading, setDownloading] = React.useState(false)

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
                    const { data, error } = await supabase.storage.from("people").createSignedUrl(file.fullPath, 60); // 60 seconds
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
                    loading={downloading}
                    aria-label={`Download: ${row.name}`}
                    icon={DownloadIcon}
                    variant="invisible"
                    onClick={async () => { setDownloading(true); downloadDataUrl(await getFileAsDataUrl("people", row.fullPath), row.name); setDownloading(false) }}
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
              if (await deleteFileOrFolder("people", selectedFile.fullPath)) {
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
        <TextInput
          placeholder="New name"
          onChange={(e) => {
            setNewFileName(e.target.value)
          }}
          sx={{ mb: 3 }}
        />
        <Dialog.Footer>
          <Button variant="primary" onClick={async () => {
            try {
              if (await moveFile("people", selectedFile.fullPath, selectedFile.fullPath.replace(selectedFile.name, newFileName))) {
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