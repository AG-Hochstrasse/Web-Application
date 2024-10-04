import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useState, useEffect, useRef } from 'react';

import { StateLabel, Box, PageHeader, RelativeTime, Button, Label, Dialog, Text, TabNav, IconButton, Stack, CounterLabel } from '@primer/react';
import { NoteIcon, AlertIcon, PeopleIcon, CommentDiscussionIcon, ArrowLeftIcon, CheckCircleIcon } from '@primer/octicons-react';
import { Banner, SkeletonText } from '@primer/react/drafts';
import PersonDetailInfo from './PersonDetailInfo';
import { Conflict, User } from '../Interfaces';
import PersonConflictList from './PersonConflictList';

export default function PersonDetail({ session }: any) {
  const { id } = useParams<{ id: string }>();

  const [person, setPerson] = useState<any>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const returnFocusRef = useRef(null)

  const [selectedTab, setSelectedTab] = useState('details');

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
  }, []);

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
          <StateLabel status="issueOpened">Open</StateLabel>
          <Label variant={person.hidden ? "secondary" : "success"}>{person.hidden ? "Hidden" : "Published"}</Label>
          {/* @ts-ignore */}
          Created <RelativeTime dateTime="2024-09-07T17:32:24.118969+00:00" />
        </PageHeader.Description>
        <PageHeader.Actions>
          { ((user?.read_write ?? 0) >= (person.hidden ? 3 : 4)) && <Button onClick={() => {navigate(`/people/${id}/edit`)}}>Edit</Button> }
          <Button variant="primary"
            data-testid="trigger-button"
            ref={returnFocusRef}
            onClick={() => setIsOpen(true)}
          >Complete</Button>
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
              <AlertIcon /> <Text ml={1}>Conflicts {conflicts.length > 0 && <CounterLabel>{conflicts.filter((conflict) => conflict.open).length /* don't need to filter by type because 'confirmed's are always closed */}</CounterLabel>}</Text>
            </TabNav.Link>
            <TabNav.Link selected={selectedTab === 'confirmed'} onClick={() => setSelectedTab('confirmed')}>
              <CheckCircleIcon size={16} /> <Text ml={1}>Confirmed data</Text>
            </TabNav.Link>
          </TabNav>

          {/* Content for each tab */}
          <Box mt={3}>
            {selectedTab === 'details' && <PersonDetailInfo person={person} conflicts={conflicts} />}
            {selectedTab === 'discussion' && <Text>Coming soon...</Text>}
            {selectedTab === 'photos' && <Text>Coming soon...</Text>}
            {selectedTab === 'conflicts' && <PersonConflictList conflicts={conflicts.filter((conflict) => conflict.type != "confirmed")} confirmed={false} /* TODO: this is not beautiful. Set default value *//>}
            {selectedTab === 'confirmed' && <PersonConflictList conflicts={conflicts.filter((conflict) => conflict.type == "confirmed")} confirmed/>}
          </Box>
        </PageHeader.Navigation>
      </PageHeader>
      {/* @ts-ignore */}
      <Dialog returnFocusRef={returnFocusRef} isOpen={isOpen} onDismiss={() => setIsOpen(false)} aria-labelledby="header" >
        <div data-testid="inner">
          {/* @ts-ignore */}
          <Dialog.Header id="header">Title</Dialog.Header>
          <Box p={3}>
            <Text>Some content</Text>
          </Box>
          <Box p={3} borderTop="1px solid" borderColor="border.default" display="flex" justifyContent="flex-end">
            <Button variant="primary">Close</Button>
          </Box>
        </div>
      </Dialog>
    </Box>
  );
};