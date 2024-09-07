import { Button, Header, Heading, Text, Avatar, Box, Octicon } from '@primer/react'
import { ThreeBarsIcon, FileMediaIcon } from '@primer/octicons-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

export default function AppHome() {
  return <Box
    as="table"
    sx={{
      width: '100%',
      borderCollapse: 'collapse',  // Collapses borders into a single line
      my: 4,                        // Adds margin
      border: '1px solid',
      borderColor: 'border.default', // Use Primer’s border color
    }}
  >
    <thead>
      <tr>
        <Box as="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'border.default', textAlign: 'left'}}>Name</Box>
        <Box as="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'border.default', textAlign: 'left' }}>Age</Box>
        <Box as="th" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'border.default', textAlign: 'left' }}>Occupation</Box>
      </tr>
    </thead>
    <tbody>
      <tr>
        <Box as="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'border.default' }}>John</Box>
        <Box as="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'border.default' }}>28</Box>
        <Box as="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'border.default' }}>Engineer</Box>
      </tr>
    </tbody>
  </Box>
}