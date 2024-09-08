import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useState, useEffect, useRef } from 'react';

import { StateLabel, Box, PageHeader, RelativeTime, Button, Label, Dialog, Text, TabNav, IconButton, Stack } from '@primer/react';
import { NoteIcon, AlertIcon, PeopleIcon, CommentDiscussionIcon, ArrowLeftIcon } from '@primer/octicons-react';
import { SkeletonText } from '@primer/react/drafts';
import PeopleDetailDetails from './PeopleDetailDetails';

const PersonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [person, setPerson] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false)
  const returnFocusRef = useRef(null)

  const [selectedTab, setSelectedTab] = useState('details');

  const navigate = useNavigate();

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

  return (
    <Box
      sx={{
        padding: 3,
      }}
    >
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.LeadingAction><IconButton icon={ArrowLeftIcon} aria-label="Back" variant="invisible" onClick={() => navigate("/")} /></PageHeader.LeadingAction>
          <PageHeader.Title>{person.name}</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Description>
          {/* @ts-ignore */}
          <StateLabel status="issueOpened">Open</StateLabel>
          <Label variant={person.hidden ? "secondary" : "success"}>{person.hidden ? "Hidden" : "Published"}</Label>
          {/* @ts-ignore */}
          Created <RelativeTime dateTime="2024-09-07T17:32:24.118969+00:00" />
        </PageHeader.Description>
        <PageHeader.Actions>
          <Button>Edit</Button>
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
              <AlertIcon /> <Text ml={1}>Conflicts</Text>
            </TabNav.Link>
          </TabNav>

          {/* Content for each tab */}
          <Box mt={3}>
            {selectedTab === 'details' && <PeopleDetailDetails person={person} />}
            {selectedTab === 'discussion' && <Text>Coming soon...</Text>}
            {selectedTab === 'photos' && <Text>Coming soon...</Text>}
            {selectedTab === 'conflicts' && <Text>Coming soon...</Text>}
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

export default PersonDetail;
