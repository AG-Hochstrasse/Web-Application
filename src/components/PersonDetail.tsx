import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useState, useEffect, useRef } from 'react';

import { StateLabel, Box, PageHeader, RelativeTime, Button, Label, Dialog, Text, TabNav, IconButton, Stack, CounterLabel, ButtonGroup, ActionMenu, ActionList } from '@primer/react';
import { NoteIcon, AlertIcon, PeopleIcon, CommentDiscussionIcon, ArrowLeftIcon, CheckCircleIcon, IssueClosedIcon, IssueTrackedByIcon, IssueReopenedIcon } from '@primer/octicons-react';
import { SkeletonText, Banner } from '@primer/react/drafts';
import PersonDetailInfo from './PersonDetailInfo';
import { Conflict, User } from '../Interfaces';
import PersonConflictList from './PersonConflictList';
import { PostgrestError } from '@supabase/supabase-js'

async function updatePersonState(to: string, id: number) {
  const { data, error } = await supabase
    .from('people')
    .update({state: to})
    .eq('id', id)

  return { data, error }
}

async function updatePersonHidden(to: boolean, id: number) {
  const { data, error } = await supabase
    .from('people')
    .update({hidden: to})
    .eq('id', id)

    return { data, error }
}

export default function PersonDetail({ session }: any) {
  const { id } = useParams<{ id: string }>();

  const [person, setPerson] = useState<any>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [databaseError, setDatabaseError] = useState<PostgrestError | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const returnFocusRef = useRef(null)

  const [selectedTab, setSelectedTab] = useState('details');

  const [retrigger, setRetrigger] = useState(false)

  const navigate = useNavigate();

  //fetch user
  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user', session.user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.log(error)
        } else if (data) {
          setUser(data)
        }
      }
      setLoading(false)
    }
    getProfile()

    return () => {
      ignore = true
    }
  }, [session])

  // fetch person
  useEffect(() => {
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
  }, [retrigger]);

  // fetch conflicts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('conflicts')
          .select('*')
          .eq('person', id);

        if (error) {
          throw error;
        }

        setConflicts(data);
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
  }, []);

  if (error) return <div>Error: {error}</div>;

  if (loading) return (
    <Box
      sx={{
        padding: 3,
      }}
    >
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.LeadingAction><IconButton icon={ArrowLeftIcon} aria-label="Back" variant="invisible" onClick={() => navigate("/")} /></PageHeader.LeadingAction>
          <PageHeader.Title><Box sx={{width: 500}}><SkeletonText size="titleMedium" /></Box></PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Description>
          <Box sx={{width: 100}}>
            <SkeletonText size="titleMedium" />
          </Box>
          <Box sx={{width: 75}}>
            <SkeletonText />
          </Box>
          <SkeletonText />
        </PageHeader.Description>
        <PageHeader.Navigation>
          {/* TabNav placeholder */}
          <Box sx={{height: 30}} />

          <Stack>
            <Stack gap="none">
              <SkeletonText maxWidth={100} />
              <SkeletonText maxWidth={500} />
            </Stack>
            <Stack gap="none">
              <SkeletonText maxWidth={100} />
              <SkeletonText maxWidth={500} />
            </Stack>
            <Stack gap="none">
              <SkeletonText maxWidth={100} />
              <SkeletonText maxWidth={500} />
            </Stack>
            <Stack gap="none">
              <SkeletonText maxWidth={100} />
              <SkeletonText maxWidth={500} />
            </Stack>
          </Stack>
        </PageHeader.Navigation>
      </PageHeader>
    </Box>
  );

  if (!person) return <>
  <Banner
    title="Person not found"
    description={<Text>Either the person you are looking for does not exist or you do not have permissions to read it.</Text>}
    variant="critical"
  /><br/>
  <Button icon={ArrowLeftIcon} onClick={() => navigate(-1)} />
  </>
  return (
    <Box
      sx={{
        padding: 3,
      }}
    >
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.LeadingAction><IconButton icon={ArrowLeftIcon} aria-label="Back" variant="invisible" onClick={() => navigate("/")} /></PageHeader.LeadingAction>
          <PageHeader.Title>{person.first_name} {person.name}</PageHeader.Title>
          <PageHeader.TrailingVisual sx={{color: '#59636e', fontWeight: 'normal'}}>#{person.id}</PageHeader.TrailingVisual>
        </PageHeader.TitleArea>
        <PageHeader.Description>
          {/* @ts-ignore */}
          <StateLabel status={person.state == "open" ? "issueOpened" : person.state == "closed" ? "issueClosed" : person.state == "canceled" ? "issueClosedNotPlanned" : "unavailable"}>{person.state == "open" ? "Open" : person.state == "closed" || person.state == "canceled" ? "Closed" : "Unavailable"}</StateLabel>
          <Label variant={person.hidden ? "secondary" : "success"}>{person.hidden ? "Hidden" : "Published"}</Label>
          {/* @ts-ignore */}
          Created <RelativeTime dateTime={person.created_at} />
        </PageHeader.Description>
        <PageHeader.Actions>
          { ((user?.read_write ?? 0) >= (person.hidden ? 3 : 4)) && <Button onClick={() => {navigate(`/people/${id}/edit`)}}>Edit</Button> }
          <Button variant="primary"
            data-testid="trigger-button"
            ref={returnFocusRef}
            onClick={() => setIsOpen(true)}
          >{person.state == "open" ? "Close" : "Reopen"} or {person.hidden ? "publish" : "unpublish"}</Button>
        </PageHeader.Actions>
        <PageHeader.Navigation>
          {/* @ts-ignore */}
          <TabNav aria-label="Main">
            <TabNav.Link selected={selectedTab === 'details'} onClick={() => setSelectedTab('details')}>
              <NoteIcon size={16} /> <Text ml={1}>Info</Text>
            </TabNav.Link>
            <TabNav.Link selected={selectedTab === 'discussion'} onClick={() => setSelectedTab('discussion')}>
              <CommentDiscussionIcon size={16} /> <Text ml={1}>Discussion</Text>
            </TabNav.Link>
            <TabNav.Link selected={selectedTab === 'photos'} onClick={() => setSelectedTab('photos')}>
              <PeopleIcon size={16} /> <Text ml={1}>Photos</Text>
            </TabNav.Link>
            <TabNav.Link selected={selectedTab === 'conflicts'} onClick={() => setSelectedTab('conflicts')}>
              <AlertIcon /> <Text ml={1}>Conflicts {conflicts.length > 0 && <CounterLabel>{conflicts.filter((conflict) => conflict.open && conflict.type != "confirmed").length /* don't need to filter by type because 'confirmed's are always closed */}</CounterLabel>}</Text>
            </TabNav.Link>
            <TabNav.Link selected={selectedTab === 'confirmed'} onClick={() => setSelectedTab('confirmed')}>
              <CheckCircleIcon size={16} /> <Text ml={1}>Confirmed data</Text>
            </TabNav.Link>
          </TabNav>
          {databaseError && <Banner title="Error" description={<Text>{databaseError.message}</Text>} variant="critical"/>}

          {/* Content for each tab */}
          <Box mt={3}>
            {selectedTab === 'details' && <PersonDetailInfo person={person} conflicts={conflicts} />}
            {selectedTab === 'discussion' && <Text>Coming soon...</Text>}
            {selectedTab === 'photos' && <Text>Coming soon...</Text>}
            {selectedTab === 'conflicts' && <PersonConflictList conflicts={conflicts.filter((conflict) => conflict.type != "confirmed")} confirmed={false} /* TODO: this is not beautiful. Set default value */ personId={+id!}/>}
            {selectedTab === 'confirmed' && <PersonConflictList conflicts={conflicts.filter((conflict) => conflict.type == "confirmed")} confirmed personId={+id!}/>}
          </Box>
        </PageHeader.Navigation>
      </PageHeader>
      {/* @ts-ignore */}
      <Dialog returnFocusRef={returnFocusRef} isOpen={isOpen} onDismiss={() => setIsOpen(false)} aria-labelledby="header" >
        <div data-testid="inner">
          {/* @ts-ignore */}
          <Dialog.Header id="header">{person.state == "open" ? "Close" : "Reopen"} or {person.hidden ? "publish" : "unpublish"} person</Dialog.Header>
          <Box p={3}>
            <Text>
              Publishing a person makes it visible in generated documents using this database and for all visitors of this website (future).
              <br /><br />
              Closing a person marks it as done and complete. Only close a person when it's completeley done and all fields are confirmed.
            </Text>
          </Box>
          <Box p={3} borderTop="1px solid" borderColor="border.default">
            {<Button sx={{mb: 2}} block variant="primary" onClick={
              () => {
                const a = updatePersonState(person.state == "open" ? "closed" : "open", person.id)
                a.then((response) => {
                  if (response.error) setDatabaseError(response.error)
                })
                setError(error)
                setIsOpen(false)
                setRetrigger(!retrigger)
              }}>{person.state == "open" ? "Close" : "Reopen"} person</Button>}
              {person.state != "canceled" && 
              <Button sx={{mb: 2}} block onClick={
                () => {
                  const a = updatePersonState("canceled", person.id)
                  a.then((response) => {
                    if (response.error) setDatabaseError(response.error)
                  })
                setError(error)
                setIsOpen(false)
                setRetrigger(!retrigger)
                }
              }>Close as not planned</Button>}
              <Button block onClick={
                () => {
                  const a = updatePersonHidden(!person.hidden, person.id)
                  a.then((response) => {
                    if (response.error) setDatabaseError(response.error)
                  })
                setError(error)
                setIsOpen(false)
                setRetrigger(!retrigger)
                }
              }>{person.hidden ? "Publish" : "Unpublish"} person</Button>
              
              
          </Box>
        </div>
      </Dialog>
    </Box>
  );
};