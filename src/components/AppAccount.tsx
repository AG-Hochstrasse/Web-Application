import React, { useState, useEffect } from 'react';
import { signIn } from '../services/supabaseClient';
import { supabase } from '../services/supabaseClient';

export default function AppAccount() {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      }
      // @ts-ignore
      setSession(session);
    };
    fetchSession();
  }, []);

  return (
    session
  )
}