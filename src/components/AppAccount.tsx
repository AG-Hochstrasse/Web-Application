import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '../Interfaces';
import { FormControl, TextInput, Box, Stack, Spinner, Text, Button } from '@primer/react';

export default function AppAccount({ session }: any) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)
      const { user } = session

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user', user.id)
        .single()

      if (!ignore) {
        if (error) {
          alert(JSON.stringify(error))
          console.warn(error)
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

  // async function updateProfile(event: any, avatarUrl: string) {
  //   event.preventDefault()

  //   setLoading(true)
  //   const { user } = session

  //   const updates = {
  //     id: user.id,
  //     username,
  //     website,
  //     avatar_url: avatarUrl,
  //     updated_at: new Date(),
  //   }

  //   const { error } = await supabase.from('profiles').upsert(updates)

  //   if (error) {
  //     alert(JSON.stringify(error))
  //   } else {
  //     setAvatarUrl(avatarUrl)
  //   }
  //   setLoading(false)
  // }

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
          <TextInput value={user?.username}></TextInput>
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