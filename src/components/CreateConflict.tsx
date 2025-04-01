import { ArrowLeftIcon } from "@primer/octicons-react";
import { Button, FormControl, IconButton, PageHeader, Text, Stack, Box, TextInput, Select, Textarea, Label } from "@primer/react";
import { supabase } from "../services/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { Banner } from '@primer/react/experimental'
import { conflictablePersonFields, UnidentifiedConflict, User } from "../Interfaces";
import { useNavigate, useParams } from "react-router-dom";

async function createConflict(newData: UnidentifiedConflict) {
  const { data, error } = await supabase
    .from('conflicts')
    .insert(newData);

  return { data: data, error: error }
}

export default function CreateConflict({session}: any) {
  const personId = useParams<{ id: string }>().id
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null)

  const [databaseError, setDatabaseError] = useState<PostgrestError | null>()
  const [submitting, setSubmitting] = useState(false)

  const [field, setField] = useState("name")
  const [type, setType] = useState<"conflict" | "not_confirmed" | "improvement" | "confirmed">("conflict")
  const [comments, setComments] = useState<string | null>(null)

  useEffect(() => {
    async function getProfile() {

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user', session.user.id)
        .single()

      if (error) {
        console.log(error)
      } else if (data) {
        setUser(data)
      }
    }
    getProfile()
  }, [])

  return <>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.LeadingAction><IconButton icon={ArrowLeftIcon} aria-label="Back" variant="invisible" onClick={() => navigate(-1)} /></PageHeader.LeadingAction>
        <PageHeader.Title>Create conflict</PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
    <br />
    {databaseError && <Banner
      title={`Database error (${databaseError.code})`}
      description={
        <Stack>
          <Text>{databaseError.message}</Text>
          {databaseError.details &&
            <Text as="i">{databaseError.details && <Text as="strong">{databaseError.details}</Text>}</Text>
          }
          {databaseError.hint && <Text>
            <Text as="strong">Hint</Text>: {databaseError.hint}
          </Text>}

        </Stack>
      }
      variant="critical"
    />}
    <Box as="form">
      <Stack>
        <FormControl>
          <FormControl.Label>Field</FormControl.Label>
          <Select onChange={(e) => setField(e.target.value)}>
            {conflictablePersonFields.map((field) => (
              <Select.Option value={field}>{field[0].toUpperCase() + field.slice(1).replaceAll("_", " ")}</Select.Option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormControl.Label>Type</FormControl.Label>
          <Select onChange={(e) => setType(e.target.value as "conflict" | "not_confirmed" | "improvement" | "confirmed")}>
            <Select.Option value="conflict">Conflict</Select.Option>
            <Select.Option value="not_confirmed">Not confirmed</Select.Option>
            <Select.Option value="improvement">Improvement</Select.Option>
            <Select.Option value="confirmed">Confirmed</Select.Option>
          </Select>
        </FormControl>

        <FormControl>
          <FormControl.Label>Comments</FormControl.Label>
          <Textarea required placeholder="Write some text describing your conflict/field confirmation" onChange={(e) => setComments(e.target.value)} />
        </FormControl>
        <FormControl>
          <Button variant="primary" loading={submitting} disabled={submitting} onClick={async () => {
            setSubmitting(true)
            const response = await createConflict({
              created_by: user ? +user!.id : 0,
              created_by_name: user?.username ?? "Unknown",
              person: +personId!,
              field: field,
              comment: comments,
              type: type,
              open: true
            })
            setSubmitting(false)
            if (response.error) {
              setDatabaseError(response.error)
            }
            else {
              setDatabaseError(null)
              navigate(`/people/${personId}`)
            }
          }}>Create</Button>
        </FormControl>
      </Stack>
    </Box >
  </>
}
