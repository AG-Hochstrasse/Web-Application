import React from "react";
import { supabase } from "../services/supabaseClient";
import { Person } from "../Person";
import { PageHeader, Box, IconButton } from '@primer/react';
import { ArrowLeftIcon } from '@primer/octicons-react';

async function insert(newData: Person) {
  const { data, error } = await supabase
    .from('people')  // Specify your table name
    .insert(newData); // Insert the new data
}
export default async function InsertPeople({ session }: any) {

  return (
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.LeadingAction><IconButton icon={ArrowLeftIcon} aria-label="Back" variant="invisible" onClick={() => navigate("/")} /></PageHeader.LeadingAction>
        <PageHeader.Title><Box sx={{ width: 500 }}>Create person</Box></PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  )
}