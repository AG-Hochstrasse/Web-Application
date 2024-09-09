import React from "react";
import { supabase } from "../services/supabaseClient";

export default async function InsertPeople({ session }: any) {
  alert(JSON.stringify(session.user.id))
  const newData = {
    //user_id: session.user.id, // You can include the user's ID in your insert data
    name: 'John Doe',
    birth: '2023-09-08',
    death: null,
  };
  alert(JSON.stringify(newData))
  // Insert data into your Supabase table (e.g., 'people')
  const { data, error } = await supabase
    .from('people')  // Specify your table name
    .insert(newData); // Insert the new data
  alert(data)
  alert(JSON.stringify(error))
  if (error) {
    return <div>Error inserting data</div>
  } else {
    return <div>Success</div>
  }
}