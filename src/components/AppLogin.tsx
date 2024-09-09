import React, { useState } from 'react';
import { signIn } from '../services/supabaseClient';
import { supabase } from '../services/supabaseClient';
import { Navigate } from 'react-router-dom';

const AppLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      await signIn(email, password);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }

    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      }
      // @ts-ignore
      setSession(session)
      alert(session?.user.email)
    };
    fetchSession();
  };

  return (<>
    { session && <Navigate to="/account" /> }
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Log In</button>
      {error && <p>{error}</p>}
    </form>
    </>
  );
};

export default AppLogin;