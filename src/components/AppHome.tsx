import { Stack, Heading, Text, Spinner, Box, Octicon, Link } from '@primer/react'
import { ThreeBarsIcon, FileMediaIcon } from '@primer/octicons-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PeopleTable from './PeopleTable';
import WhatsNew from './WhatsNew';
import { useEffect, useState } from 'react';
import { User } from '../Interfaces';
import { supabase } from '../services/supabaseClient';
import { Banner } from '@primer/react/drafts';

export default function AppHome(props: any) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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
      setLoading(false)
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [props.session])

  if(loading) {
    return <Stack direction="horizontal" align="center"><Spinner /><Text>Loading...</Text></Stack>
  }
  return <Stack>
    <Heading>Welcome, { user?.username ?? props.session.user.email }!</Heading>
    {!user?.username && <Banner title="Have you already set a display name?" description={
      <Text>
        Click on your Avatar in the top right corner of this page. You can set a display name there.<br/>
        <Link as={RouterLink} to="/account">Let's see</Link>
      </Text>
    } variant="upsell" />}
    <WhatsNew />
    
    <PeopleTable />
    
  </Stack>
}