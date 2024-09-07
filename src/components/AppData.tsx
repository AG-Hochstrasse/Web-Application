import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { ThemeProvider, Octicon, Box, Link } from '@primer/react';
import { Router, Link as RouterLink } from 'react-router-dom';
import { EyeClosedIcon } from '@primer/octicons-react';

import StateIcon from './StateIcon';

const AppData: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box
      as="table"
      sx={{
        width: '100%',
        borderCollapse: 'collapse',
        my: 4,
        border: '1px solid',
        borderColor: 'border.default',
      }}
    >
      <thead>
        <tr>
          <Box as="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'border.default', textAlign: 'left' }} colSpan={2}></Box>
          <Box as="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'border.default', textAlign: 'left' }}>Name</Box>
          <Box as="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'border.default', textAlign: 'left' }}>Birth</Box>
          <Box as="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'border.default', textAlign: 'left' }}>Death</Box>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any) => (
          <tr key={item.id}>
            <Box
              as="td"
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'border.default',
                cursor: 'pointer',
                width: 2
              }}
              component={RouterLink}
              to={`/detail/${item.id}`}
            >{ item.hidden ? <Octicon icon={EyeClosedIcon} /> : <></> }</Box>
            <Box
              as="td"
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'border.default',
                cursor: 'pointer',
                width: 2
              }}
              component={RouterLink}
              to={`/detail/${item.id}`}
            ><StateIcon state={item.status}></StateIcon></Box>
            <Box
              as="td"
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'border.default',
                cursor: 'pointer',
              }}
              component={RouterLink}
              to={`/detail/${item.id}`}
            >
              <Link as={RouterLink} to={`/detail/${item.id}`} sx={{ color: 'unset' }}>{item.name}</Link>
            </Box>
            <Box
              as="td"
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'border.default',
                cursor: 'pointer',
              }}
              component={RouterLink}
              to={`/detail/${item.id}`}
            >
              <Link as={RouterLink} to={`/detail/${item.id}`} sx={{ color: 'unset' }}>{item.birth}</Link>
            </Box>
            <Box
              as="td"
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'border.default',
                cursor: 'pointer',
              }}
              component={RouterLink}
              to={`/detail/${item.id}`}
            >
              <Link as={RouterLink} to={`/detail/${item.id}`} sx={{ color: 'unset' }}>{item.death}</Link>
            </Box>
          </tr>
        ))}
      </tbody>
    </Box>
  );
};

export default AppData;
