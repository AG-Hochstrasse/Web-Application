import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Person } from "../Person";
import { PageHeader, Box, IconButton, FormControl, TextInput, Spinner, Stack, Text, Textarea } from '@primer/react';
import { ArrowLeftIcon } from '@primer/octicons-react';
import { useNavigate, useParams } from "react-router-dom";
import { Banner } from '@primer/react/experimental'

async function editPeople(insert: boolean = false, newData: Person) {
  if (insert) {
    const { data, error } = await supabase
      .from('people')
      .insert(newData);

    return { data, error }
  }
}

export default function InsertPeople({ session, insert }: any) {
  const navigate = useNavigate()
  const id = useParams<{ id: string }>()

  const [person, setPerson] = useState<Person | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!insert)

  useEffect(() => {
    if (!insert) {
      const fetchData = async () => {
        try {
          const { data, error } = await supabase
            .from('people')
            .select('*')
            .eq('id', id);

          if (error) {
            throw error;
          }

          setPerson(data[0]);
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
        There was an error fetching the data. Check your internet connection or try again later.
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
          <PageHeader.LeadingAction><IconButton icon={ArrowLeftIcon} aria-label="Back" variant="invisible" onClick={() => navigate("/")} /></PageHeader.LeadingAction>
          <PageHeader.Title>{insert ? "Create new" : "Edit"} person</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>
      <br />

      <Box as="form">
        <FormControl>
          {!insert && <>
            <FormControl.Label>ID</FormControl.Label>
            <TextInput monospace disabled value={person!.id} />
          </>}
          <FormControl.Label>Name</FormControl.Label>
          <TextInput />

          <FormControl.Label>Birth</FormControl.Label>
          <TextInput />

          <FormControl.Label>Death</FormControl.Label>
          <TextInput />

          <FormControl.Label>Place of birth</FormControl.Label>
          <TextInput />

          <FormControl.Label>Place of death</FormControl.Label>
          <TextInput />

          <FormControl.Label>Cause of death</FormControl.Label>
          <TextInput />

          <FormControl.Label>Residence</FormControl.Label>
          <TextInput />

          <FormControl.Label>Comments</FormControl.Label>
          <Textarea />
        </FormControl>
      </Box>
    </>
  )
}