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
import InsertPeople from './components/InsertPeople';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { ThemeProvider, Box } from '@primer/react'
import AppLogin from './components/AppLogin';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from './services/supabaseClient';

export function App() {
  const [session, setSession] = useState<any>();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  

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
            providers={["google", "facebook", "github"]}
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
            <Route path="/login" element={<AppLogin />} />
            <Route path="/people" element={<PeopleTable />} />
            <Route path="/people/:id" element={<PersonDetail />} />
            <Route path="/about" element={<AppAbout />} />
            <Route path="/account" element={<AppAccount session={session} />} />
            <Route path="/people/new" element={<InsertPeople session={session} />} />
          </Routes>
        </Box>

      </Router>
    </ThemeProvider>
  )
}

export default App;