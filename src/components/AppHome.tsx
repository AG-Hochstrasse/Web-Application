import { Button, Header, Heading, Text, Avatar, Box, Octicon } from '@primer/react'
import { ThreeBarsIcon, FileMediaIcon } from '@primer/octicons-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PeopleTable from './PeopleTable';

export default function AppHome(props: any) {
  return <>
    <Heading>Welcome {props.session && props.session.user.email }!</Heading>
    <PeopleTable/>
    
  </>
}