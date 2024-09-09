import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      }
      // @ts-ignore
      setSession(session);
    };
    fetchSession();
  }, []);
  alert(session)
  return session ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
