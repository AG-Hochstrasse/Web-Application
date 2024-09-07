// DetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useState, useEffect } from 'react';

import { StateLabel, Box, PageHeader, RelativeTime, Button, Octicon } from '@primer/react';
import { PencilIcon } from '@primer/octicons-react';

const PersonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [person, setPerson] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
      <Box
        sx={{
          padding: 3,
        }}
      >
        <PageHeader>
          <PageHeader.TitleArea>
            <PageHeader.Title>{person.name}</PageHeader.Title>
          </PageHeader.TitleArea>
          <PageHeader.Description>
            {/* @ts-ignore */}
            <StateLabel status="issueOpened">Open</StateLabel>
            {/* @ts-ignore */}
            Created <RelativeTime dateTime="2024-09-07T17:32:24.118969+00:00" />
          </PageHeader.Description>
          <PageHeader.Actions>
            <Button>Edit</Button>
            <Button variant="primary">Complete</Button>
          </PageHeader.Actions>
        </PageHeader>
      </Box>
      );
};

export default PersonDetail;
