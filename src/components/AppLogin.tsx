import React, { useEffect, useState } from 'react';
import { signIn } from '../services/supabaseClient';
import { supabase } from '../services/supabaseClient';
import { Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const AppLogin = () => {
  return <div>Hello</div>
};

export default AppLogin;