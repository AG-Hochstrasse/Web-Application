import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Octicon, Box, Link, RelativeTime, Stack, Spinner, Text, Button, PageHeader } from '@primer/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { EyeClosedIcon, RepoIcon } from '@primer/octicons-react';
import { SkeletonAvatar, SkeletonText } from '@primer/react/drafts';
import { Banner, DataTable } from '@primer/react/experimental';

import StateIcon from './StateIcon';

import { Person } from '../Person';

const PeopleTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('people') // Replace with your table name
          .select('*');

        if (error) {
          throw error;
        }

        setData(data);
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

  if (!data || data.length === 0) {
    return <Box my={4}>No data available</Box>;
  }

  return (
    <Box my={4}>
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.Title>People</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Actions>
          {location.pathname != "/people" && <Button onClick={ () => { navigate("/people")}}>Show all</Button>}
          <Button variant="primary"
            data-testid="trigger-button"
            onClick={() => navigate("/people/new")}
          >New</Button>
        </PageHeader.Actions>
      </PageHeader>
      <br />
      <DataTable
        aria-labelledby="people-table"
        aria-describedby="people-table-description"
        columns={[
          {
            header: 'Name',
            field: 'name',
            rowHeader: true,
            renderCell: (row: Person) => (
              <Stack direction="horizontal">
                <StateIcon state={row.state} />
                {row.hidden ? <Octicon icon={EyeClosedIcon} /> : <Octicon icon={RepoIcon} />}
                <Link as={RouterLink} to={`/people/${row.id}`} sx={{ color: 'unset' }}>
                  {row.name}
                </Link>
              </Stack>
            ),
          },
          {
            header: 'Birth',
            field: 'birth',
            renderCell: (row: Person) => (
              <Link as={RouterLink} to={`/people/${row.id}`} sx={{ color: 'unset' }}>
                {row.birth}
              </Link>
            ),
          },
          {
            header: 'Death',
            field: 'death',
            renderCell: (row: Person) => (
              <Link as={RouterLink} to={`/people/${row.id}`} sx={{ color: 'unset' }}>
                {row.death}
              </Link>
            ),
          },
          {
            header: 'ID',
            field: 'id',
            renderCell: (row: Person) => (
              <Link as={RouterLink} to={`/people/${row.id}`} sx={{ color: 'unset', fontFamily: 'monospace' }}>
                {row.id}
              </Link>
            )
          },
          {
            header: 'Created',
            field: 'created_at',
            renderCell: (row: Person) => (
              <Link as={RouterLink} to={`/people/${row.id}`} sx={{ color: 'unset' }}>
                {/* @ts-ignore */}
                <RelativeTime dateTime={row.created_at} />
              </Link>
            )
          }
        ]}
        data={data}
      />
    </Box>
  );

};

export default PeopleTable;

function SkeletonPeopleRow() {
  return <tr>
    <Box
      as="td"
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'border.default',
        cursor: 'pointer',
        width: 2
      }}
    >
      {/* @ts-ignore */}
      <SkeletonAvatar size={16} square />
    </Box>
    <Box
      as="td"
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'border.default',
        cursor: 'pointer',
        width: 2
      }}
    >
      {/* @ts-ignore */}
      <SkeletonAvatar size={16} square /></Box>
    <Box
      as="td"
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'border.default',
        cursor: 'pointer'
      }}
    ><SkeletonText /></Box>
    <Box
      as="td"
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'border.default',
        cursor: 'pointer',
      }}
    ><SkeletonText /></Box>
    <Box
      as="td"
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'border.default',
        cursor: 'pointer',
      }}
    ><SkeletonText /></Box>
  </tr>
}