import { useEffect, useRef, useState } from "react"
import { Person, Link } from "../Interfaces"
import { getLinksByPerson } from "../services/database"
import { Box, Button, Dialog, FormControl, IconButton, RelativeTime, Spinner, Stack, Text, TextInput, Link as URLLink } from "@primer/react"
import { DataTable, Table } from '@primer/react/experimental'
import { PlusIcon } from "@primer/octicons-react"
import React from "react"
import { updatePersonState, updatePersonHidden } from "./PersonDetail"
import { supabase } from "../services/supabaseClient"

const PersonLinkList = (props: { person: Person }) => {
  const [links, setLinks] = useState<Link[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showDialog, setDialog] = useState(false)
  const dialogButtonRef = useRef<HTMLButtonElement>(null)

  const [name, setName] = useState("")
  const [url, setURL] = useState("")

  const fetchData = async () => {
    setLoading(true)
    const response = await getLinksByPerson(props.person.id)
    if (response.data) {
      setLinks(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (error) {
    return <Text>{error}</Text>
  }

  if (loading) {
    return <Spinner />
  }

  if (!links) {
    return <Text>An error occurred.</Text>
  }

  return <>
    <Table.Container>
      <Table.Actions>
        <IconButton icon={PlusIcon} ref={dialogButtonRef} onClick={() => setDialog(true)} aria-label="Add link" variant="invisible" />
      </Table.Actions>
      <DataTable
        aria-labelledby="links"
        aria-describedby="assigned links"
        data={links}
        columns={[
          {
            rowHeader: true,
            header: () => {
              return <Text>Name</Text>
            },
            field: "name",
            renderCell: (row) => {
              return <Text>{row.name}</Text>
            }
          },
          {
            header: () => {
              return <Text>URL</Text>
            },
            field: "url",
            renderCell: (row) => {
              return <URLLink href={row.url}>{row.url}</URLLink>
            }
          },
          {
            header: () => {
              return <Text>Created</Text>
            },
            field: "created_at",
            renderCell: (row) => {
              {/* @ts-ignore */ }
              return <RelativeTime dateTime={row.created_at} />
            }
          }
        ]}
      />
    </Table.Container>
    {
      showDialog && (
        // @ts-ignore
        <Dialog
          // @ts-ignore
          onDismiss={() => {
            setDialog(false)
            setName("")
            setURL("")
          }}
          // @ts-ignore
          isOpen={showDialog}
        >
          <div data-testid="inner">
            {/* @ts-ignore */}
            <Dialog.Header id="header">Create link</Dialog.Header>
            <Box p={3} as="form">
              <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <TextInput onChange={(e) => setName(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>URL</FormControl.Label>
                <TextInput onChange={(e) => setURL(e.target.value)} />
              </FormControl>
            </Box>
            <Box p={3} borderTop="1px solid" borderColor="border.default">
              <Stack direction="horizontal" align="end"> {/* TODO: Fix alignment */}
                <Button sx={{ mb: 2 }} onClick={
                  () => {
                    setDialog(false)
                    setName("")
                    setURL("")
                  }
                }>Cancel</Button>
                <Button sx={{ mb: 2 }} variant="primary" onClick={() => {
                  const insertData = async () => {
                    const response = await supabase
                      .from("links")
                      .insert({
                        name: name,
                        url: url,
                        person: props.person.id
                      })
                    if (response.error) {
                      setError(response.error.message)
                    }
                    setDialog(false)
                    setName("")
                    setURL("")
                    fetchData()
                  }
                  insertData()
                }}>Create</Button>
              </Stack>
            </Box>
          </div>
        </Dialog>
      )
    }

  </>
}

export default PersonLinkList;