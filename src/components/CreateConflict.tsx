import { ArrowLeftIcon } from "@primer/octicons-react";
import { Button, FormControl, IconButton, PageHeader, Text, Stack, Box, TextInput } from "@primer/react";
import { supabase } from "../services/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { useState } from "react";
import {Banner} from '@primer/react/experimental'
import { UnidentifiedConflict } from "../Interfaces";

async function createConflict(newData: UnidentifiedConflict) {
    const { data, error } = await supabase
      .from('conflicts')
      .insert(newData);
  
    return { data: data, error: error }
  }

export default function CreateConflict() {
    const [databaseError, setDatabaseError] = useState<PostgrestError | null>()
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
          {!insert && <>
            <FormControl.Label>ID</FormControl.Label>
            <TextInput monospace disabled value={person!.id} />
          </>}
        </FormControl>
        <FormControl>
          <FormControl.Label>Fist name</FormControl.Label>
          {/* @ts-ignore */}
          <TextInput value={firstName} onChange={(e) => { setFirstName(e.target.value); }} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          {/* @ts-ignore */}
          <TextInput required value={name} onChange={(e) => { setName(e.target.value); }} />
        </FormControl>

        <FormControl>
          <FormControl.Label>Birth</FormControl.Label>
          {/* @ts-ignore */}
          <TextInput value={birth} leadingVisual={CalendarIcon} onChange={(e) => { setBirth(e.target.value); }} />
        </FormControl>

        <FormControl>
          <FormControl.Label>Death</FormControl.Label>
          {/* @ts-ignore */}
          <TextInput value={death} leadingVisual={CalendarIcon} onChange={(e) => { setDeath(e.target.value ? e.target.value : null); }} />
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
          <Button variant="primary" loading={submitting} disabled={submitting} onClick={() => {
            const a = createConflict({
              name: name, first_name: firstName, birth: String(birth), hidden: true, state: "open", death: String(death), birth_place: birthPlace, death_place: deathPlace,
              death_cause: deathCause, residence: residence, comments: comments,
              born_as: bornAs,
              work: work,
              age: age,
              origin: origin,
              grave_number: graveNumber,
              religion: religion,
              insurance_doc_number: insuranceDocNumber,
              death_register_number: deathRegisterNumber,
              stay_time: stayTime,
              work_start_bs: workStartBS,
              death_time: deathTime,
              marriage_status: marriageStatus,
              children: children,
              burial_day: burialDay
            })
            a.then((response) => {
              if (response) {
                setDatabaseError(response.error)
              }
            })
            setSubmitting(true)
            setTimeout(() => {
              navigate("/people")
            }, 1000)
          }}>Create</Button>
        </FormControl>
      </Stack>
    </Box>
  </>
}