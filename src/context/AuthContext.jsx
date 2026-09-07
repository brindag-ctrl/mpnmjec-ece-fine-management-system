import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext(null);

const DEFAULT_ADMIN = {
  uid: 'admin_ece_mpnmjec',
  email: 'ece-admin@mpnmjec.ac.in',
  displayName: 'Prof. S. Ranganathan (HOD / ECE)',
  role: 'Department Administrator',
  department: 'Electronics and Communication Engineering',
  college: 'M.P. Nachimuthu M. Jaganathan Engineering College',
};

const LOCAL_STORAGE_AUTH_KEY = 'mpnmjec_ece_auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage persistence first
    try {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore
    }

    // If live Firebase auth is active, listen to state changes
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const authData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'ECE Department Faculty',
            role: 'Department Administrator',
            department: 'Electronics and Communication Engineering',
            college: 'M.P. Nachimuthu M. Jaganathan Engineering College',
          };
          setUser(authData);
          localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authData));
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // 1. Try Firebase Auth if configured
    if (isFirebaseConfigured() && auth) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const authData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || 'ECE Department Staff',
          role: 'Department Administrator',
          department: 'Electronics and Communication Engineering',
          college: 'M.P. Nachimuthu M. Jaganathan Engineering College',
        };
        setUser(authData);
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authData));
        return authData;
      } catch (fbErr) {
        console.warn('Firebase login failed, testing fallback admin credentials:', fbErr);
        // If it's the standard demo credentials, allow fallback
        if (
          (email.trim().toLowerCase() === 'ece-admin@mpnmjec.ac.in' || email.trim().toLowerCase() === 'admin@ece.edu' || email.trim().toLowerCase() === 'admin@mpnmjec.ac.in') &&
          password === 'eceadmin123'
        ) {
          const demoUser = { ...DEFAULT_ADMIN, email: email.trim().toLowerCase() };
          setUser(demoUser);
          localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(demoUser));
          return demoUser;
        }
        throw fbErr;
      }
    }

    // 2. Demo / Fallback Authentication Mode
    if (
      (email.trim().toLowerCase() === 'ece-admin@mpnmjec.ac.in' || 
       email.trim().toLowerCase() === 'admin@ece.edu' || 
       email.trim().toLowerCase() === 'admin@mpnmjec.ac.in' ||
       email.trim().toLowerCase() === 'faculty@mpnmjec.ac.in') &&
      (password === 'eceadmin123' || password === 'admin123' || password === 'password')
    ) {
      const authUser = {
        ...DEFAULT_ADMIN,
        email: email.trim().toLowerCase(),
        displayName: email.includes('faculty') ? 'Dr. M. Venkatesan (ECE Faculty)' : 'Prof. S. Ranganathan (HOD / ECE)',
      };
      setUser(authUser);
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authUser));
      return authUser;
    }

    // Also support any valid email + password for instant testing convenience if in demo mode
    if (email && password && password.length >= 6) {
      const authUser = {
        uid: 'user_' + Date.now(),
        email: email.trim(),
        displayName: email.split('@')[0].toUpperCase() + ' (Staff)',
        role: 'Department Staff',
        department: 'Electronics and Communication Engineering',
        college: 'M.P. Nachimuthu M. Jaganathan Engineering College',
      };
      setUser(authUser);
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authUser));
      return authUser;
    }

    throw new Error('Invalid email or password. Use demo credentials or password with at least 6 characters.');
  };

  const logout = async () => {
    if (isFirebaseConfigured() && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.error('Firebase signout error:', err);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
