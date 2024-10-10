import { ArrowLeftIcon } from "@primer/octicons-react";
import { Conflict } from "../Interfaces";
import { Button, IconButton, PageHeader, Stack, Text, Spinner, StateLabel, RelativeTime, Box, Timeline, Avatar, Label } from "@primer/react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useEffect } from "react";
import { useState } from "react";

export default function ConflictDetail() {
  const { id } = useParams<{ id: string }>();

  const [conflict, setConflict] = useState<Conflict | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string | null>()
  const [personId, setPersonId] = useState<number | null>()

  // fetch conflict by route param and linked person's name
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('conflicts')
          .select('*')
          .eq('id', id)
          .limit(1)
          .single()

        if (error) {
          throw error;
        }

        setConflict(data);
        const fetchedData = data;
        try {

          if (fetchedData) {
            const { data, error } = await supabase
              .from('people')
              .select('name, first_name, id')
              .eq('id', fetchedData.person)
              .limit(1)
              .single()


            if (error) {
              throw error;
            }

            setName(`${data.first_name ?? "?"} ${data.name}`);
            setPersonId(data.id)
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false)
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }

    };

    fetchData();
  }, []);


  const navigate = useNavigate()

  if (error) return <div>Error: {error}</div>;

  if (loading) return <Stack direction="horizontal" align="center"><Spinner /><Text>Loading...</Text></Stack>

  if (!conflict) return <div>Error fetching data</div>

  return <>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.LeadingAction><IconButton icon={ArrowLeftIcon} aria-label="Back" variant="invisible" onClick={() => navigate(`/people/${personId}`)} /></PageHeader.LeadingAction>
        <PageHeader.Title>{name && `${name} / `}{conflict.field.replaceAll("_", " ").toUpperCase()}</PageHeader.Title>
        <PageHeader.TrailingVisual sx={{ color: '#59636e', fontWeight: 'normal' }}>#{conflict.id}</PageHeader.TrailingVisual>
      </PageHeader.TitleArea>
      <PageHeader.Description>
        {/* @ts-ignore */}
        <StateLabel status="issueOpened">Open</StateLabel>
        <>
                {conflict.type == "conflict" && <Label variant='severe'>Conflict</Label>}
                {conflict.type == "not_confirmed" && <Label variant='attention'>Not confirmed</Label>}
                {conflict.type == "improvement" && <Label variant='accent'>Improvement</Label>}
                {conflict.type == "confirmed" && <Label variant='success'>Confirmed</Label>}
              </>
        {/* @ts-ignore */}
        Opened <RelativeTime dateTime={conflict.created_at} /> by Octocat
      </PageHeader.Description>
      <PageHeader.Actions>
        <Button onClick={() => { }}>Edit</Button>
        <Button onClick={() => { }} variant="primary">Close conflict</Button>
      </PageHeader.Actions>
    </PageHeader>


    <Timeline>
      {/* Comment 1 */}
      <Timeline.Item>
        <Timeline.Badge>
          <Avatar src="https://github.com/octocat.png" size={40} alt="Octocat" />
        </Timeline.Badge>
        <Timeline.Body>
          <Box>
            <Text fontWeight="bold">Octocat</Text>
            {/* @ts-ignore */}
            <Text fontSize={1} color="fg.muted"> commented <RelativeTime dateTime={conflict.created_at}/> </Text>
          </Box>
          <Box mt={2} sx={{color: 'fg.default'}}>
            <Text>{conflict.comment}</Text>
          </Box>
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  </>
}