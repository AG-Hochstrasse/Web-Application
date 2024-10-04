import { Button, Header, IconButton, Text, Avatar, Link, Octicon } from '@primer/react'
import { ThreeBarsIcon, FileMediaIcon } from '@primer/octicons-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import Sidebar from './AppSidebar';
import { useState } from 'react';
import AppSidebar from './AppSidebar';

export default function AppHeader(props: any) {
  const [showSidebar, setShowSidebar] = useState(false)
  return <Header>
    <Header.Item>
      <AppSidebar/>
    </Header.Item>
  
    <Header.Item full>
      <Header.Link as={RouterLink} to="/" mr={2} sx={{ fontSize: 2, }}>
        <Octicon icon={FileMediaIcon} size={32} sx={{ mr: 2, }} />
      </Header.Link>
    </Header.Item>

    <Header.Item sx={{ mr: 0 }} >
      {/* @ts-ignore */}
      <ProfileMenu session={props.session}/>
    </Header.Item>
  </Header>
}