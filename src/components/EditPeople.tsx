import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Person, UnIdentifiedPerson } from "../Person";
import { PageHeader, Box, IconButton, FormControl, TextInput, Spinner, Stack, Text, Textarea, Button } from '@primer/react';
import { ArrowLeftIcon } from '@primer/octicons-react';
import { useNavigate, useParams } from "react-router-dom";
import { Banner } from '@primer/react/experimental'
import { darkThemes } from "@supabase/auth-ui-shared";
import { PostgrestError } from "@supabase/supabase-js";

async function createPerson(newData: UnIdentifiedPerson) {
  if (newData.birth == "null") {
    newData.birth = null
  }
  if (newData.death == "null") {
    newData.death = null
  }
  const { data, error } = await supabase
    .from('people')
    .insert(newData);

  return { data: data, error: error }
}

async function editPerson(data: Person) {
  if (data.birth == "null") {
    data.birth = null
  }
  if (data.death == "null") {
    data.death = null
  }

  const { error } = await supabase
  .from('people')
  .update(data)
  .eq('id', data.id)

  return error
}
export default function EditPeople({ session, insert }: any) {
  const navigate = useNavigate()
  const id = useParams<{ id: string }>()

  const [person, setPerson] = useState<Person | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [databaseError, setDatabaseError] = useState<PostgrestError | null>(null)
  const [loading, setLoading] = useState(!insert)

  const [name, setName] = useState<string>("")
  const [birth, setBirth] = useState<string | null>(person?.birth ? person.birth : null)
  const [death, setDeath] = useState<string | null>(person?.death ? person.death : null)
  const [birthPlace, setBirthPlace] = useState<string | null>(person?.birth_place ? person.birth_place : null)
  const [deathPlace, setDeathPlace] = useState<string | null>(person?.death_place ? person.death_place : null)
  const [deathCause, setDeathCause] = useState<string | null>(person?.death_cause ? person.death_cause : null)
  const [residence, setResidence] = useState<string | null>(person?.residence ? person.residence : null)
  const [comments, setComments] = useState<string>(person ? person.comments : "")

  useEffect(() => {
    if (!insert) {
      const fetchData = async () => {
        try {
          const { data, error } = await supabase
            .from('people')
            .select('*')
            .eq('id', id.id);

          if (error) {
            setDatabaseError(error)
          }

          if (!data) {
            setError("Unknown error")
          }
          const person = data![0]
          setPerson(person);
          setName(person.name)
          setBirth(person.birth)
          setDeath(person.death)
          setBirthPlace(person.birth_place)
          setDeathPlace(person.death_place)
          setDeathCause(person.death_cause)
          setResidence(person.residence)
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }

      };

      fetchData();
    }
  }, []);

  if (error) return <Banner
    title="Error"
    description={
      <>
        There was an error fetching the data: {error}. Check your internet connection or try again later.
      </>
    }
    variant="critical"
  />;

  if (loading) {
    return <Stack direction="horizontal" align="center"><Spinner /><Text>Loading...</Text></Stack>
  }

  return (
    <>
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.LeadingAction><IconButton icon={ArrowLeftIcon} aria-label="Back" variant="invisible" onClick={() => navigate("/people")} /></PageHeader.LeadingAction>
          <PageHeader.Title>{insert ? "Create new" : "Edit"} person</PageHeader.Title>
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
            {!insert && <>
              <FormControl.Label>ID</FormControl.Label>
              <TextInput monospace disabled value={person!.id} />
            </>}
          </FormControl>
          <FormControl>
            <FormControl.Label>Name</FormControl.Label>
            {/* @ts-ignore */}
            <TextInput required value={name} onChange={(e) => { setName(e.target.value); }} />
          </FormControl>

          <FormControl>
            <FormControl.Label>Birth</FormControl.Label>
            {/* @ts-ignore */}
            <TextInput type="date" value={birth} onChange={(e) => { setBirth(e.target.value ? e.target.value : null); }} />
          </FormControl>

          <FormControl>
            <FormControl.Label>Death</FormControl.Label>
            {/* @ts-ignore */}
            <TextInput type="date" value={death} onChange={(e) => { setDeath(e.target.value ? e.target.value : null); }} />
          </FormControl>

          <FormControl>
            <FormControl.Label>Place of birth</FormControl.Label>
            {/* @ts-ignore */}
            <TextInput value={birthPlace} onChange={(e) => { setBirthPlace(e.target.value); }} />
          </FormControl>

          <FormControl>
            <FormControl.Label>Place of death</FormControl.Label>
            {/* @ts-ignore */}
            <TextInput value={deathPlace} onChange={(e) => { setDeathPlace(e.target.value); }} />
          </FormControl>

          <FormControl>
            <FormControl.Label>Cause of death</FormControl.Label>
            {/* @ts-ignore */}
            <TextInput value={deathCause} onChange={(e) => { setDeathCause(e.target.value); }} />
          </FormControl>

          <FormControl>
            <FormControl.Label>Residence</FormControl.Label>
            {/* @ts-ignore */}
            <TextInput value={residence} onChange={(e) => { setResidence(e.target.value); }} />
          </FormControl>

          <FormControl>
            <FormControl.Label>Comments</FormControl.Label>
            {/* @ts-ignore */}
            <Textarea value={comments} onChange={(e) => { setComments(e.target.value); }} />
            <FormControl.Caption>For conflicting data, please create a conflict instead after creating this person.</FormControl.Caption>
          </FormControl>

          <FormControl>
            {insert ? <Button variant="primary" onClick={() => {
              const a = createPerson({ name: name, birth: String(birth), hidden: true, state: "open", death: String(death), birth_place: birthPlace, death_place: deathPlace, death_cause: deathCause, residence: residence, comments: comments })
              a.then((response) => {
                if (response) {
                  setDatabaseError(response.error)
                }
              })
            }}>Create</Button> :
              <Button variant="primary" onClick={() => {
                const a = editPerson({ name: name, birth: String(birth), hidden: true, state: "open", death: String(death), birth_place: birthPlace, death_place: deathPlace, death_cause: deathCause, residence: residence, comments: comments, created_at: String(new Date()), id: id.id!})
                a.then((error) => {
                  if (error) {
                    setDatabaseError(error)
                  }
                })
                navigate(`/people/${id.id}`)
              }}>Update</Button>
            }
          </FormControl>
        </Stack>
      </Box>
    </>
  )
}