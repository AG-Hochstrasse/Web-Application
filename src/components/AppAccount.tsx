import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function AppAccount({ session }: any) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  // useEffect(() => {
  //   let ignore = false
  //   async function getProfile() {
  //     setLoading(true)
  //     const { user } = session

  //     const { data, error } = await supabase
  //       .from('profiles')
  //       .select(`username, website, avatar_url`)
  //       .eq('id', user.id)
  //       .single()

  //     if (!ignore) {
  //       if (error) {
  //         alert(JSON.stringify(error))
  //         console.warn(error)
  //       } else if (data) {
  //         setUsername(data.username)
  //         setWebsite(data.website)
  //         setAvatarUrl(data.avatar_url)
  //       }
  //     }

  //     setLoading(false)
  //   }

  //   //getProfile()

  //   return () => {
  //     ignore = true
  //   }
  // }, [session])

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

  return (<>
    {/* @ts-ignore */}
    <form className="form-widget">
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

      <div>
        <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </form></>
  )
}