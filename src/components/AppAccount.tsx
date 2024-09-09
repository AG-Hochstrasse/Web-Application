import React from 'react';

export default function AppAccount({ session }: any) {
  return (
    <div>hello, {session && session.user.email }</div>
    
   )
}
