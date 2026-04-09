/**
 * Navbar Component
 * UPDATED: Converted from crime reporting to college complaint system
 * UPDATED: Changed role names (citizen→user, police→worker)
 * UPDATED: Updated navbar imports to match new naming
 * UPDATED: Simplified authentication logic
 * 
 * @description Dynamic navbar that renders different navbars based on authentication status and user role
 * @version 2.0.0 (Updated for complaint management)
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';
import WorkerNavbar from './WorkerNavbar';
import GuestNavbar from './GuestNavbar';
import { getToken, isValidToken, getRole } from '../utils/utils';

const Navbar = () => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState({
        token: null,
        valid: false,
        role: null,
        initialized: false
    });

    // Get current token value
    const currentToken = getToken();

    // Effect that runs whenever the token changes
    useEffect(() => {
        const checkAuth = () => {
            const token = getToken();
            setAuthState({
                token,
                valid: token ? isValidToken() : false,
                role: token ? getRole() : null,
                initialized: true
            });
        };

        // Initial check
        checkAuth();

        // Set up storage event listener as fallback
        const storageListener = () => checkAuth();
        window.addEventListener('storage', storageListener);

        return () => {
            window.removeEventListener('storage', storageListener);
        };
    }, [currentToken]);

    // Instant logout handling
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!authState.initialized) {
        return null;
    }

    if (!authState.token || !authState.valid) {
        return <GuestNavbar />;
    }

    switch (authState.role?.toLowerCase()) {
        case 'user':
            return <UserNavbar onLogout={handleLogout} />;
        case 'admin':
            return <AdminNavbar onLogout={handleLogout} />;
        case 'worker':
            return <WorkerNavbar onLogout={handleLogout} />;
        default:
            return <GuestNavbar />;
    }
};

export default Navbar;