import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useState, useEffect, useRef } from 'react';
import { Person, Conflict, conflictablePersonFields, ConflictType } from '../Interfaces';
import { Box, Heading, RelativeTime, Button, Label, Dialog, Text, TabNav, IconButton, LabelGroup } from '@primer/react';

interface PersonDetailInfoPros {
  person: Person
  conflicts: Conflict[]
}

const PersonDetailInfo = (props: PersonDetailInfoPros) => {
  // Helper function to check if a field has a conflict
  const hasConflict = (field: string) => {
    return props.conflicts.some(conflict => conflict.open && conflict.field === field && conflict.type == "conflict");
  };
  const hasNotConfirmed = (field: string) => {
    return props.conflicts.some(conflict => conflict.open && conflict.field === field && conflict.type == "not_confirmed")
  }
  const hasImprovement = (field: string) => {
    return props.conflicts.some(conflict => conflict.open && conflict.field === field && conflict.type == "improvement")
  }
  const hasConfirmed = (field: string) => {
    return props.conflicts.some(conflict => conflict.field === field && conflict.type == "confirmed");
  };
  return (
    <div>
      <LabelGroup>
        {props.person.exhumed && <Label variant="attention">Exhumed</Label>}
        {props.person.auto_added && <Label variant="accent">Auto-added</Label>}
      </LabelGroup>
      {conflictablePersonFields.map((field: string) => {
        // Dynamically get the value from the person object based on field name
        const fieldValue = props.person[field as keyof Person];
        if (fieldValue && typeof fieldValue !== "boolean") { // booleans are displayed as labels
          return (
            fieldValue != null && (
              <div key={field}>
                <Text as="strong">{field.replaceAll('_', ' ').toUpperCase()} </Text>
                <br />
                <Text>{fieldValue.toString()}</Text>
                <LabelGroup sx={{mt: 1}}>
                  {hasConflict(field) && <Label variant='severe' size='small'>Conflict</Label>}
                  {hasNotConfirmed(field) && <Label variant='attention' size='small'>Not confirmed</Label>}
                  {hasImprovement(field) && <Label variant='accent' size='small'>Improvement</Label>}
                  {hasConfirmed(field) && <Label variant='success' size='small'>Confirmed</Label>}
                </LabelGroup>
                <br />
              </div>
            )
          );
        }
      })}
    </div>
  );
};

export default PersonDetailInfo;
