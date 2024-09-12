import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useState, useEffect, useRef } from 'react';
import { Person } from '../Person';
import { Box, Heading, RelativeTime, Button, Label, Dialog, Text, TabNav, IconButton } from '@primer/react';

interface PeopleDetailInfoPros {
  person: Person
}

export default function PeopleDetailInfo(props: PeopleDetailInfoPros) {
  return (
    <>
      {props.person.birth && <><Text as="strong">Birth</Text><br />
        <Text>{props.person.birth}</Text><br /><br /></>}

      {props.person.death && <><Text as="strong">Death</Text><br />
        <Text>{props.person.death}</Text><br /><br /></>}

      {props.person.birth_place && <><Text as="strong">Place of birth</Text><br />
        <Text>{props.person.birth_place}</Text><br /><br /></>}

      {props.person.death_place && <><Text as="strong">Place of death</Text><br />
        <Text>{props.person.death_place}</Text><br /><br /></>}

      {props.person.death_cause && <><Text as="strong">Cause of death</Text><br />
        <Text>{props.person.death_cause}</Text><br /><br /></>}

      {props.person.residence && <><Text as="strong">Residence</Text><br />
        <Text>{props.person.residence}</Text><br /><br /></>}

      {props.person.born_as && <><Text as="strong">Born as</Text><br />
        <Text>{props.person.born_as}</Text><br /><br /></>}

      {props.person.work && <><Text as="strong">Work</Text><br />
        <Text>{props.person.work}</Text><br /><br /></>}

      {props.person.age && <><Text as="strong">Age</Text><br />
        <Text>{props.person.age}</Text><br /><br /></>}

      {props.person.origin && <><Text as="strong">Origin</Text><br />
        <Text>{props.person.origin}</Text><br /><br /></>}

      {props.person.grave_number && <><Text as="strong">Grave number</Text><br />
        <Text>{props.person.grave_number}</Text><br /><br /></>}

      {props.person.religion && <><Text as="strong">Religion</Text><br />
        <Text>{props.person.born_as}</Text><br /><br /></>}

      {props.person.insurance_doc_number && <><Text as="strong">Insurance document number</Text><br />
        <Text>{props.person.insurance_doc_number}</Text><br /><br /></>}

      {props.person.death_register_number && <><Text as="strong">Death register number</Text><br />
        <Text>{props.person.death_register_number}</Text><br /><br /></>}

      {props.person.stay_time && <><Text as="strong">Time of stay (days)</Text><br />
        <Text>{props.person.stay_time}</Text><br /><br /></>}

      {props.person.work_start_bs && <><Text as="strong">Start of work in Braunschweig</Text><br />
        <Text>{props.person.work_start_bs}</Text><br /><br /></>}

      {props.person.death_time && <><Text as="strong">Time of death</Text><br />
        <Text>{props.person.death_time}</Text><br /><br /></>}

      {props.person.marriage_status && <><Text as="strong">Marriage status</Text><br />
        <Text>{props.person.marriage_status}</Text><br /><br /></>}

      {props.person.children && <><Text as="strong">Number of children</Text><br />
        <Text>{props.person.children}</Text><br /><br /></>}

      {props.person.burial_day && <><Text as="strong">Day of burial</Text><br />
        <Text>{props.person.burial_day}</Text><br /><br /></>}

      {props.person.comments && <><Text as="strong">Comments</Text><br />
        <Text>{props.person.comments}</Text><br /><br /></>}
    </>
  )
}