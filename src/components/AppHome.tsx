import { Stack, Heading, Text, Avatar, Box, Octicon } from '@primer/react'
import { ThreeBarsIcon, FileMediaIcon } from '@primer/octicons-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PeopleTable from './PeopleTable';
import WhatsNew from './WhatsNew';
import { useEffect, useState } from 'react';
import { User } from '../Interfaces';
import { supabase } from '../services/supabaseClient';

export default function AppHome(props: any) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let ignore = false
    async function getProfile() {
      const { user } = props.session

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user', user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.log(error)
        } else if (data) {
          setUser(data)
        }
      }

    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [props.session])
  return <Stack>
    <Heading>Welcome, { user?.username ? user.username : props.session && props.session.user.email }!</Heading>
    <WhatsNew />
    
    <PeopleTable />
    
  </Stack>
}