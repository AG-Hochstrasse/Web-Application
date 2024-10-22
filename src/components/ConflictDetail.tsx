import { ArrowLeftIcon } from "@primer/octicons-react";
import { Conflict, User, Activity, UnidentifiedActivity, ActivityType } from "../Interfaces";
import { Button, IconButton, PageHeader, Stack, Text, Spinner, StateLabel, RelativeTime, Box, Timeline, Avatar, Label, Textarea } from "@primer/react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useEffect } from "react";
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { Banner } from '@primer/react/experimental'

async function updateConflictOpenState(to: boolean, id: number) {
  const { data, error } = await supabase
    .from('conflicts')
    .update({ open: to })
    .eq('id', id)

  return { data, error }
}
async function addActivity(activity: UnidentifiedActivity) {
  const { data, error } = await supabase
    .from('activity')
    .insert(activity)

  return { data, error }
}

export default function ConflictDetail({ session }: any) {
  const { id } = useParams<{ id: string }>();

  const [conflict, setConflict] = useState<Conflict | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [databaseError, setDatabaseError] = useState<PostgrestError | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState<string | null>()
  const [personId, setPersonId] = useState<number | null>()

  const [comment, setComment] = useState("")

  const [retrigger, setRetrigger] = useState(false)

  const [user, setUser] = useState<User | null>(null)
  const [activity, setActivity] = useState<Activity[]>([])

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

  // fetch conflict and activity by route param and linked person's name
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

            try {
              const { data, error } = await supabase
                .from('activity')
                .select('*')
                .eq('object_type', 'conflict')
                .eq('object', id)

              if (error) {
                console.log(error)
              } else if (data) {
                setActivity(data)
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
  }, [retrigger]);


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
        <StateLabel status={conflict.open ? "issueOpened" : "issueClosed"}>{conflict.open ? "Open" : "Closed"}</StateLabel>
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
      </PageHeader.Actions>
    </PageHeader>

    
    {databaseError && <><br/><Banner
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
    /><br/></>}
    

    <Timeline>
      <Timeline.Item>
        <Timeline.Badge>
          <Avatar src="https://github.com/octocat.png" size={40} alt="Octocat" />
        </Timeline.Badge>
        <Timeline.Body>
          <Box>
            <Text fontWeight="bold">Octocat</Text>
            {/* @ts-ignore */}
            <Text fontSize={1} color="fg.muted"> commented <RelativeTime dateTime={conflict.created_at} /> </Text>
          </Box>
          <Box mt={2} sx={{ color: 'fg.default' }}>
            <Text>{conflict.comment}</Text>
          </Box>
        </Timeline.Body>
      </Timeline.Item>

      {activity.map( (activityItem) => {
        return <Timeline.Item>
          <Timeline.Badge>
            <Avatar src="https://github.com/octocat.png" size={40} alt="Octocat" />
          </Timeline.Badge>
          <Timeline.Body>
            <Box>
              <Text fontWeight="bold">{activityItem.by_name}</Text> {activityItem.type.substring(9)} this <RelativeTime datetime={activityItem.created_at}/>
            </Box>
            <Box mt={2} sx={{ color: 'fg.default'}}>
              <Text>{activityItem.comment}</Text>
            </Box>
          </Timeline.Body>
        </Timeline.Item>
      })}
      
      {conflict.type != "confirmed" && user && user.conflict_read_write >= 3 && <Timeline.Item>
        <Timeline.Badge>
          <Avatar src="https://github.com/octocat.png" size={40} alt="Octocat" />
        </Timeline.Badge>
        <Timeline.Body>
          <Stack>
            <Text color="fg.default" fontSize={2}>Close conflict</Text>
            <Textarea value={comment} onChange={(e) => { setComment(e.target.value) }} placeholder="Add your comment for closing here..." />
            <Box p={3} display="flex" justifyContent="flex-end">
              <Button variant="primary" disabled={loading || comment.replaceAll(" ", "").replaceAll("\n", "") == ""} onClick={
                () => {
                  const a = updateConflictOpenState(!conflict.open, conflict.id)
                  a.then((response) => {
                    if (response.error) setDatabaseError(response.error)
                  })
                  const b = addActivity({
                    by: user!.id,
                    type: conflict.open ? "conflict_closed" : "conflict_reopened",
                    comment: comment,
                    object: conflict.id,
                    object_type: "conflict",
                    by_name: user.username ?? 
                    user.id
                  })
                  b.then((response) => {
                    if (response.error) setDatabaseError(response.error)
                  })
                  setError(error)
                  setRetrigger(!retrigger)
                  setComment("")
                }}>{conflict.open ? "Close" : "Reopen"} with comment</Button>
            </Box>
          </Stack>
        </Timeline.Body>
      </Timeline.Item>}
    </Timeline>
  </>
}