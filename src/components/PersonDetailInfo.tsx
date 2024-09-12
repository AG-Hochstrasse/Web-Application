import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useState, useEffect, useRef } from 'react';
import { Person, Conflict, conflictablePersonFields } from '../Person';
import { Box, Heading, RelativeTime, Button, Label, Dialog, Text, TabNav, IconButton, LabelGroup } from '@primer/react';

interface PersonDetailInfoPros {
  person: Person
  conflicts: Conflict[]
}

const PersonDetailInfo = (props: PersonDetailInfoPros) => {
  // Helper function to check if a field has a conflict
  const hasConflict = (field: string) => {
    return props.conflicts.some(conflict => conflict.field === field && conflict.type === "conflict");
  };
  const hasNotConfirmed = (field: string) => {
    return props.conflicts.some(conflict => conflict.field === field && conflict.type === "not_confirmed")
  }
  return (
    <div>
      {conflictablePersonFields.map((field: string) => {
        // Dynamically get the value from the person object based on field name
        const fieldValue = props.person[field as keyof Person];
        return (
          fieldValue != null && (
            <div key={field}>
              <Text as="strong">{field.replaceAll('_', ' ').toUpperCase()} </Text>
              {hasConflict(field) && <Label variant='severe'>Conflict</Label>}
              {hasNotConfirmed(field) && <Label variant='attention'>Not confirmed</Label>}
              <br />
              <Text>{fieldValue.toString()}</Text>
              <br /><br />
            </div>
          )
        );
      })}
    </div>
  );
};

export default PersonDetailInfo;