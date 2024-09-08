import React from 'react';
import logo from './logo.svg';
import './App.css';

import AppHeader from './components/AppHeader';
import AppHome from './components/AppHome';
import AppAbout from './components/AppAbout';
import PersonDetail from './components/PersonDetail';
import PeopleTable from './components/PeopleTable';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import {ThemeProvider, Box } from '@primer/react'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppHeader/>

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
                <Route path="/" element={<AppHome />} />
                <Route path="/people" element={<PeopleTable />} />
                <Route path="/people/:id" element={<PersonDetail />} />
                <Route path="/about" element={<AppAbout />} />
          </Routes>
        </Box>

      </Router>
    </ThemeProvider>
  )
}

export default App;