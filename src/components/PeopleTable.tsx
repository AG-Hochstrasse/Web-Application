import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Octicon, Box, Link, RelativeTime, Stack, Spinner, Text, TextInput, IconButton, Button, Header, Heading } from '@primer/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ArrowRightIcon, EyeClosedIcon, PlusIcon, RepoIcon, SearchIcon } from '@primer/octicons-react';
import { Table } from '@primer/react/drafts';
import { Banner, DataTable } from '@primer/react/experimental';

import StateIcon from './StateIcon';

import { Person } from '../Interfaces';
import { TableContainer } from '@primer/react/lib-esm/DataTable/Table';

export default function PeopleTable({ all }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = data.filter((row: Person) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(row.id).includes(searchQuery) ||
    (row.first_name?.toLowerCase() + " " + row.name.toLowerCase()).includes(searchQuery.toLowerCase()) ||
    row.birth?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.death?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.grave_number?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, all ? data.length-1 : 10);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('people')
          .select('*') 
//          .eq('exhumed', false)

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
      <TableContainer>
        <Table.Title id="people">People</Table.Title>
        <Table.Actions><IconButton icon={PlusIcon} aria-label="Add" variant="invisible" onClick={() => navigate("/people/new")} />
          {!all && <IconButton icon={ArrowRightIcon} aria-label="Show all" variant="invisible" onClick={() => navigate("/people")} />}
        </Table.Actions>
        <TextInput
          leadingVisual={SearchIcon}
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }} // Adding some margin below search bar
        />
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
                    {row.first_name} {row.name}
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
              header: 'Grave number',
              field: 'grave_number',
              renderCell: (row: Person) => (
                <Link as={RouterLink} to={`/people/${row.grave_number}`} sx={{ color: 'unset' }}>
                  {row.grave_number}
                </Link>
              )
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
          data={filteredData}
        />
      </TableContainer>
      {!all && <><br/><Button leadingVisual={ArrowRightIcon} onClick={() => navigate("/people")} >Show all</Button></>}
    </Box>
  );
};
