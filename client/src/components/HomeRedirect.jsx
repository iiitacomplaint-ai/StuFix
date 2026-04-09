/**
 * HomeRedirect Component
 * UPDATED: Converted from crime reporting to college complaint system
 * UPDATED: Changed role names (citizen→user, police→worker)
 * UPDATED: Updated dashboard routes to match complaint system
 * UPDATED: Changed landing page route
 * 
 * @description Redirects authenticated users to their respective dashboards based on role
 * @version 2.0.0 (Updated for complaint management)
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole, isValidToken } from '../utils/utils';

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isValidToken()) {
      const role = getRole();
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'user':
          navigate('/user/dashboard', { replace: true });
          break;
        case 'worker':
          navigate('/worker/dashboard', { replace: true });
          break;
        default:
          // If no valid role, remove token and redirect to landing page
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/', { replace: true });
      }
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return null;
};

export default HomeRedirect;