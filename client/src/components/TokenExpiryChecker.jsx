import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetUser } from '../slices/userSlice';
import { isValidToken } from '../utils/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// Routes where TokenExpiryChecker should do nothing
const PUBLIC_ROUTES = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];

const TokenExpiryChecker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ✅ Don't run on public routes — user isn't logged in here
    if (PUBLIC_ROUTES.some(route => location.pathname.startsWith(route))) {
      return;
    }

    // ✅ No token means not logged in — nothing to check
    const token = localStorage.getItem('token');
    if (!token) return;

    let lastActivityTime = Date.now();
    let inactivityTimeoutShown = false;

    const updateActivity = () => {
      lastActivityTime = Date.now();
      inactivityTimeoutShown = false;
    };

    const handleLogout = (reason) => {
      console.log(`🔴 ${reason}. Logging out...`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(resetUser());

      if (reason.includes('inactive')) {
        toast.info('You have been logged out due to inactivity.');
      } else if (reason.includes('expired')) {
        toast.warning('Your session has expired. Please login again.');
      }

      navigate('/login');
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll', 'mousedown'];
    activityEvents.forEach(event => window.addEventListener(event, updateActivity));

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');

      // ✅ If token was removed (logout happened elsewhere), stop checking
      if (!token) {
        clearInterval(interval);
        return;
      }

      const inactiveTime = Date.now() - lastActivityTime;
      const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 min
      const WARNING_TIME = 25 * 60 * 1000;      // 25 min

      // ✅ Check token validity
      if (!isValidToken()) {
        handleLogout('Token expired');
        return;
      }

      // ✅ Check inactivity
      if (inactiveTime > INACTIVITY_LIMIT) {
        handleLogout('User inactive for 30 minutes');
      } else if (inactiveTime > WARNING_TIME && !inactivityTimeoutShown) {
        inactivityTimeoutShown = true;
        toast.warning('You will be logged out due to inactivity in 5 minutes.');
      }
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
      activityEvents.forEach(event => window.removeEventListener(event, updateActivity));
    };

  // ✅ Re-run effect when route changes so public route check stays accurate
  }, [dispatch, navigate, location.pathname]);

  return null;
};

export default TokenExpiryChecker;