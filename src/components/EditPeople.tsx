import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { displayedPersonFields, Person, UnIdentifiedPerson, User } from "../Interfaces";
import { PageHeader, Box, IconButton, FormControl, TextInput, Spinner, Stack, Text, Textarea, Button, Details, useDetails, Checkbox } from '@primer/react';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, FoldIcon, NumberIcon } from '@primer/octicons-react';
import { useNavigate, useParams } from "react-router-dom";
import { Banner } from '@primer/react/experimental'
import { darkThemes } from "@supabase/auth-ui-shared";
import { PostgrestError } from "@supabase/supabase-js";
import useStateObject from "../utils/useStateObject";
import { capitalizeWords } from "../utils/capitalizeWords";

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

async function editPerson(person: UnIdentifiedPerson, id: string) {
  if (person.birth == "null") {
    person.birth = null
  }
  if (person.death == "null") {
    person.death = null
  }

  const { data, error } = await supabase
    .from('people')
    .update(person)
    .eq('id', id)

  return { data: data, error: error }
}
export default function EditPeople({ session, insert }: any) {
  const navigate = useNavigate()
  const id = useParams<{ id: string }>()

  const [error, setError] = useState<string | null>(null)
  const [databaseError, setDatabaseError] = useState<PostgrestError | null>(null)
  const [loading, setLoading] = useState(!insert)
  const [submitting, setSubmitting] = useState(false)

  const [person, setPerson] = useStateObject<Person | null>(null)

  const { getDetailsProps } = useDetails({
    closeOnOutsideClick: false,
  })

  const [user, setUser] = useState<User | null>(null)

  // fetch user
  useEffect(() => {
    async function getProfile() {
      setLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user', session.user.id)
        .single()

      if (error) {
        console.log(error)
      } else if (data) {
        console.log(data)
        setUser(data)
      }
      setLoading(false)
    }
    getProfile()
  }, [])
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
          const person: Person = data![0]
          setPerson(person);
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

  if (user) {
    if ((!person || insert || person.hidden) && user.read_write < 3) {
      return <>
        <Banner
          title="You are not allowed to write people"
          description={<Text>You do not have the required permissions for this action. Contact your admin.</Text>}
          variant="critical"
        />
        <br />
        <Button icon={ArrowLeftIcon} onClick={() => (navigate(-1))} />
      </>
    }
    if (person && !person.hidden && user.read_write < 4) {
      return <>
        <Banner
          title="You are not allowed to write public people"
          description={<Text>You do not have the required permissions for this action. Contact your admin.</Text>}
          variant="critical"
        />
        <br />
        <Button icon={ArrowLeftIcon} onClick={() => (navigate(-1))} />
      </>
    }
  }
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
          <PageHeader.LeadingAction><IconButton icon={ArrowLeftIcon} aria-label="Back" variant="invisible" onClick={() => navigate(-1)} /></PageHeader.LeadingAction>
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
            <FormControl.Label>ID</FormControl.Label>
            <TextInput disabled value={person ? person.id : ""} />
            <FormControl.Caption>The ID cannot be changed.</FormControl.Caption>
          </FormControl>
          {displayedPersonFields.map((field: string) => {
            // Dynamically get the value from the person object based on field name
            const fieldValue = person ? person[field as keyof Person] : null;

            if (typeof fieldValue === "boolean") {
              return (
                <FormControl disabled={ !fieldValue && field === "auto_added" } > {/* auto_added can't be enabled manually */}
                  <FormControl.Label>{capitalizeWords(field.replaceAll("_", " "))}</FormControl.Label>
                  <Checkbox checked={fieldValue} onChange={(e) => {
                    setPerson({ [field as keyof Person]: e.target.checked })
                  }
                  } />
                </FormControl>
              );
            }
            return (
              <FormControl key={field}>
                <FormControl.Label>{capitalizeWords(field.replaceAll("_", " "))}</FormControl.Label>
                <TextInput
                  value={fieldValue as string}
                  onChange={(e) =>
                    setPerson({ [field as keyof Person]: e.target.value })
                  }
                />
              </FormControl>
            );
          })}

          <FormControl>
            {insert ? <Button variant="primary" loading={submitting} disabled={submitting} onClick={() => {
              if (person) {
                const a = createPerson(person)
                a.then((response) => {
                  if (response) {
                    setDatabaseError(response.error)
                  }
                })
                setSubmitting(true)
                setTimeout(() => {
                  navigate("/people")
                }, 1000)
              }
            }}>Create</Button> :
              <Button variant="primary" loading={submitting} disabled={submitting} onClick={() => {
                if (person) {
                  const a = editPerson(person, id.id!)
                  a.then((response) => {
                    if (response.error) {
                      setDatabaseError(response.error)
                    }
                  })
                  setSubmitting(true)
                  setTimeout(() => {
                    window.location.href = `/people/${id.id}`
                  }, 1000)
                }
              }}>Update</Button>
            }
          </FormControl>
        </Stack>
      </Box>
    </>
  )
}
