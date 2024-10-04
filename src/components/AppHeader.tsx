import { Button, Header, Heading, Text, Avatar, Link, Octicon } from '@primer/react'
import { ThreeBarsIcon, FileMediaIcon, ArrowUpRightIcon } from '@primer/octicons-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';

export default function AppHeader(props: any) {
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

    <Header.Item>
      <Header.Link sx={{ fontWeight: 'normal' }} as={RouterLink} to="/people" >
        People
      </Header.Link>
    </Header.Item>

    <Header.Item>
      <Header.Link sx={{ fontWeight: 'normal' }} as={RouterLink} to="/about" >
        About
      </Header.Link>
    </Header.Item>

    <Header.Item full >
      <Header.Link sx={{ fontWeight: 'normal' }} as={RouterLink} to="/whatsnew" >
        Updates
      </Header.Link>
    </Header.Item>

    <Header.Item>
      <Header.Link href="https://github.com/AG-Hochstrasse/Web-Application">
        <ArrowUpRightIcon/> GitHub
      </Header.Link>
    </Header.Item>
    
    <Header.Item sx={{ mr: 0, }} >
      {/* @ts-ignore */}
      <ProfileMenu session={props.session} />
    </Header.Item>
  </Header >
}