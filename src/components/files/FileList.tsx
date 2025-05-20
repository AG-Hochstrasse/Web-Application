import React from "react";
import { Banner, DataTable, Dialog, Table } from "@primer/react/experimental";
import { Text, Link as URLLink, RelativeTime, Link, Box, IconButton, Button } from "@primer/react";
import { DownloadIcon, PencilIcon, TrashIcon } from "@primer/octicons-react";
import { deleteFileOrFolder } from "../../utils/deleteFileOrFolder";

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

export default function FileList({ files, update }: { files: LocatedFileObj[], update?: () => void }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const onDialogClose = React.useCallback(() => setIsOpen(false), [])

  const [selectedFile, setSelectedFile] = React.useState<LocatedFileObj | null>(null)

  const [error, setError] = React.useState<string | null>(null)

  if (!files || files.length === 0) {
    return <Text>No files available.</Text>;
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
              renderCell: (file) => <Link>{file.name}</Link>,
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
                    aria-label={`Download: ${row.name}`}
                    icon={DownloadIcon}
                    variant="invisible"
                    onClick={() => { }}
                  />
                  <IconButton ref={buttonRef}
                    aria-label={`Delete: ${row.name}`}
                    icon={TrashIcon}
                    variant="invisible"
                    onClick={() => { setSelectedFile(row); setIsOpen(!isOpen) }}
                  />
                  <IconButton
                    aria-label={`Rename: ${row.name}`}
                    icon={PencilIcon}
                    variant="invisible"
                    onClick={() => { }}
                  />
                </>
              }

            }
          ]}
        />
      </Table.Container>
      {/* @ts-ignore */}
      {isOpen && selectedFile && <Dialog title="Confirm deletion" onClose={onDialogClose} returnFocusRef={buttonRef}>
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
              setIsOpen(false)
            }
          }}>
            Delete
          </Button>
        </Dialog.Footer>
      </Dialog>}
    </>
  );
};