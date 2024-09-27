import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '../Interfaces';
import { FormControl, TextInput, Box, Stack, Spinner, Text, Button } from '@primer/react';

export default function AppAccount({ session }: any) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const [userName, setUsername] = useState<string>(user?.username ?? "")

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
          console.log(data)
          setUser(data)
          setUsername(data.username)
          console.log(user)
        }
      }

      setLoading(false)
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [session])

  async function updateProfile() {
    setLoading(true)
    
    const updates = {
      username: userName,
      // updated_at: new Date(),
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq("user", user?.user) // TODO

    if (error) {
      alert(JSON.stringify(error))
    } else {
      setUsername(userName)
    }
    setLoading(false)
  }

  if (loading) {
    return <Stack direction="horizontal" align="center"><Spinner /><Text>Loading...</Text></Stack>
  }
  return (<>
    {/* @ts-ignore */}
    <Box as="form" >
      {/*<div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          required
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div> */}
      <Stack>
        <FormControl>
          <FormControl.Label>Username</FormControl.Label>
          {/* @ts-ignore */}
          <TextInput value={userName} onChange={(event) => setUsername(event.target.value)}></TextInput>
        </FormControl>
        <FormControl>
          <Button onClick={() => updateProfile()} variant="primary" disabled={loading} loading={loading}>
            Save settings
          </Button>
        </FormControl>
        <FormControl>
          <Button onClick={() => supabase.auth.signOut()}>
            Sign Out
          </Button>
        </FormControl>
      </Stack>
    </Box></>
  )
}