import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Person, UnIdentifiedPerson } from "../Interfaces";
import { PageHeader, Box, IconButton, FormControl, TextInput, Spinner, Stack, Text, Textarea, Button, Details, useDetails } from '@primer/react';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, FoldIcon, NumberIcon } from '@primer/octicons-react';
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

  return {data: data, error: error }
}
export default function EditPeople({ session, insert }: any) {
  const navigate = useNavigate()
  const id = useParams<{ id: string }>()

  const [person, setPerson] = useState<Person | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [databaseError, setDatabaseError] = useState<PostgrestError | null>(null)
  const [loading, setLoading] = useState(!insert)
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState<string>("")
  const [firstName, setFirstName] = useState<string | null>(null)
  const [birth, setBirth] = useState<string | null>(null)
  const [death, setDeath] = useState<string | null>(null)
  const [birthPlace, setBirthPlace] = useState<string | null>(null)
  const [deathPlace, setDeathPlace] = useState<string | null>(null)
  const [deathCause, setDeathCause] = useState<string | null>(null)
  const [residence, setResidence] = useState<string | null>(null)
  const [comments, setComments] = useState<string>("")

  const [bornAs, setBornAs] = useState<string | null>(null)
  const [work, setWork] = useState<string | null>(null)
  const [age, setAge] = useState<number | null>(null)
  const [origin, setOrigin] = useState<string | null>(null)
  const [graveNumber, setGraveNumber] = useState<string | null>(null)
  const [religion, setReligion] = useState<string | null>(null)
  const [insuranceDocNumber, setInsuranceDocNumber] = useState<number | null>(null)
  const [deathRegisterNumber, setDeathRegisterNumber] = useState<string | null>(null)
  const [stayTime, setStayTime] = useState<number | null>(null)
  const [workStartBS, setWorkStartBS] = useState<string | null>(null)
  const [deathTime, setDeathTime] = useState<Date | null>(null)
  const [marriageStatus, setMarriageStatus] = useState<string | null>(null)
  const [children, setChildren] = useState<number | null>(null)
  const [burialDay, setBurialDay] = useState<string | null>(null)

  const { getDetailsProps } = useDetails({
    closeOnOutsideClick: false,
  })
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
          setName(person.name)
          setFirstName(person.first_name)
          setBirth(person.birth)
          setDeath(person.death)
          setBirthPlace(person.birth_place)
          setDeathPlace(person.death_place)
          setDeathCause(person.death_cause)
          setResidence(person.residence)
          setComments(person.comments)
          setBornAs(person.born_as)
          setWork(person.work)
          setAge(person.age)
          setOrigin(person.origin)
          setGraveNumber(person.grave_number)
          setReligion(person.religion)
          setInsuranceDocNumber(person.insurance_doc_number)
          setDeathRegisterNumber(person.death_register_number)
          setStayTime(person.stay_time)
          setWorkStartBS(person.work_start_bs)
          setDeathTime(person.death_time)
          setMarriageStatus(person.marriage_status)
          setChildren(person.children)
          setBurialDay(person.burial_day)
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

          <Details {...getDetailsProps()}>
            <Button leadingVisual={FoldIcon} as="summary" sx={{ mb: 3 }} >More</Button>
            <Stack>
              <FormControl>
                <FormControl.Label>Born as</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput value={bornAs} onChange={(e) => { alert(bornAs); setBornAs(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Work</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput value={work} onChange={(e) => { setWork(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Age</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput type="number" leadingVisual={NumberIcon} value={age} onChange={(e) => { setAge(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Origin</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput value={origin} onChange={(e) => { setOrigin(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Grave numver</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput value={graveNumber} onChange={(e) => { setGraveNumber(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Religion</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput value={religion} onChange={(e) => { setreligion(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Insurance doc number</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput value={insuranceDocNumber} leadingVisual={NumberIcon} onChange={(e) => { setInsuranceDocNumber(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Death register number</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput type="number" leadingVisual={NumberIcon} value={deathRegisterNumber} onChange={(e) => { setDeathRegisterNumber(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Time of stay (days)</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput type="number" leadingVisual={NumberIcon} value={stayTime} onChange={(e) => { setStayTime(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Start of work in Braunschweig</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput value={workStartBS} leadingVisual={CalendarIcon} onChange={(e) => { setWorkStartBS(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Time of death</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput type="time" leadingVisual={ClockIcon} value={deathTime} onChange={(e) => { setDeathTime(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Marriage status</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput value={marriageStatus} onChange={(e) => { setMarriageStatus(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Number of children</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput type="number" value={children} leadingVisual={NumberIcon} onChange={(e) => { setChildren(e.target.value); }} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Day of burial</FormControl.Label>
                {/* @ts-ignore */}
                <TextInput value={burialDay} leadingVisual={CalendarIcon} onChange={(e) => { setBurialDay(e.target.value); }} />
              </FormControl>
            </Stack>
          </Details>

          <FormControl>
            {insert ? <Button variant="primary" loading={submitting} disabled={submitting} onClick={() => {
              const a = createPerson({
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
            }}>Create</Button> :
              <Button variant="primary" loading={submitting} disabled={submitting} onClick={() => {
                const a = editPerson({
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
                }, id.id!)
                a.then((response) => {
                  if (response.error) {
                    setDatabaseError(response.error)
                  }
                })
                setSubmitting(true)
                setTimeout(() => {
                  window.location.href = `/people/${id.id}`
                }, 1000)
              }}>Update</Button>
            }
          </FormControl>
        </Stack>
      </Box>
    </>
  )
}