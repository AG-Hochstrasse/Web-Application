import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useState, useEffect, useRef } from 'react';

import { Box, Heading, RelativeTime, Button, Label, Dialog, Text, TabNav, IconButton } from '@primer/react';


export default function PeopleDetailDetails(props: any) {
  return (
    <>
      {props.person.birth && <><Text as="strong">Birth</Text><br />
      <Text>{props.person.birth}</Text><br/><br/></>}

      {props.person.death && <><Text as="strong">Death</Text><br />
      <Text>{props.person.death}</Text><br/><br/></>}
      
      {props.person.birth_place && <><Text as="strong">Place of birth</Text><br />
      <Text>{props.person.birth_place}</Text><br/><br/></>}

      {props.person.death_place && <><Text as="strong">Place of death</Text><br />
      <Text>{props.person.death_place}</Text><br/><br/></>}

      {props.person.death_cause && <><Text as="strong">Cause of death</Text><br />
      <Text>{props.person.death_cause}</Text><br/><br/></>}

      {props.person.residence && <><Text as="strong">Residence</Text><br />
      <Text>{props.person.residence}</Text><br/><br/></>}

      {props.person.comment && <><Text as="strong">Comments</Text><br />
      <Text>{props.person.comments}</Text></>}
    </>
  )
}