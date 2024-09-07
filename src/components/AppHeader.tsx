import { Button, Header, Heading, Text, Avatar, Box, Octicon } from '@primer/react'
import { ThreeBarsIcon, FileMediaIcon } from '@primer/octicons-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

export default function AppHeader() {
  return <Header>
    <Header.Item>
      <Header.Link as={RouterLink} to="/" mr={2} sx={{ fontSize: 2, }}>
        <Octicon icon={FileMediaIcon} size={32} sx={{ mr: 2, }} />
        <span>AG Hochstraße</span>
      </Header.Link>
    </Header.Item>

    <Header.Item>
      <Header.Link sx={{ fontWeight: 'normal' }} as={RouterLink} to="/" >
        Home
      </Header.Link>
    </Header.Item>

    <Header.Item full >
      <Header.Link sx={{ fontWeight: 'normal' }} as={RouterLink} to="/about" >
        About
      </Header.Link>
    </Header.Item>

    <Header.Item sx={{ mr: 0, }} >
      <Avatar src="https://github.com/octocat.png" size={30} square alt="@octocat" />
    </Header.Item>
  </Header>
}