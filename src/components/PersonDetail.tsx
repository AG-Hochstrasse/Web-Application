// DetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useState, useEffect } from 'react';

import { StateLabel } from '@primer/react';

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
    <div>
      <h1>Detail Page</h1>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Name:</strong> {person.name}</p>
      <p><strong>Birth:</strong> {person.birth}</p>
      <p><strong>Death:</strong> {person.death}</p>
    </div>
  );
};

export default PersonDetail;
