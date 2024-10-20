import React, { useEffect, useState, createContext } from 'react';
import logo from './logo.svg';
import './App.css';

import { useContext } from 'react';
import AppHeader from './components/AppHeader';
import AppHome from './components/AppHome';
import AppAbout from './components/AppAbout';
import PersonDetail from './components/PersonDetail';
import PeopleTable from './components/PeopleTable';
import AppAccount from './components/AppAccount';
import EditPeople from './components/EditPeople';
import NotFound from './components/NotFound';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { ThemeProvider, Box, Spinner, Stack, Text } from '@primer/react'
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from './services/supabaseClient';
import WhatsNew from './components/WhatsNew';
import ConflictDetail from './components/ConflictDetail';
import CreateConflict from './components/CreateConflict';
import Playground from './components/AppPage';

export function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  
  if (loading) {
    return <Stack direction="horizontal" align="center"><Spinner /><Text>Loading...</Text></Stack>
  }

  if (!session) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["github"]}
            showLinks={false}
          />
        </div>
      </div>
    );
  }

  return (
    
    <ThemeProvider>
      <Router>
        <AppHeader />

        <Box
          as="main" // Semantic main element
          sx={{
            p: 4, // Padding
            bg: 'canvas.default', // Background color based on theme (light or dark)
            color: 'fg.default', // Text color based on theme (light or dark)
            borderRadius: 2, // Optional border-radius
            mx: 'auto' // Center the content horizontally
          }}
        >
          <Routes>
            <Route path="/" element={<AppHome session={session}/>} />
            <Route path="/people" element={<PeopleTable all />} />
            <Route path="/people/:id" element={<PersonDetail session={session} />} />
            <Route path="/people/:id/edit" element={<EditPeople session={session} />} />
            <Route path="/people/new" element={<EditPeople session={session} insert />} />
            <Route path="/people/:id/conflicts/new" element={<CreateConflict />} />
            <Route path="/conflicts/:id" element={<ConflictDetail session={session} />} />
            <Route path="/about" element={<AppAbout />} />
            <Route path="/whatsnew" element={<WhatsNew all />} />
            <Route path="/account" element={<AppAccount session={session} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>

      </Router>
    </ThemeProvider>
  )
}

export default App;