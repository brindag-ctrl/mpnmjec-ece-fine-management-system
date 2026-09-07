import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext(null);

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
    // Strict Live Firebase Authentication
    if (isFirebaseConfigured() && auth) {
      try {
        const result = await signInWithEmailAndPassword(auth, email.trim(), password);
        const fbUser = result.user;
        const nameFromEmail = fbUser.email ? fbUser.email.split('@')[0].toUpperCase() : 'ECE Staff';
        
        const authData = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || `${nameFromEmail} (ECE Faculty)`,
          role: 'Department Administrator',
          department: 'Electronics and Communication Engineering',
          college: 'M.P. Nachimuthu M. Jaganathan Engineering College',
        };
        setUser(authData);
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authData));
        return authData;
      } catch (fbErr) {
        console.error('Firebase authentication error:', fbErr);
        let errorMsg = 'Authentication failed. Please check your credentials.';
        if (fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/user-not-found') {
          errorMsg = 'Invalid email address or password. Please verify your credentials in Firebase.';
        } else if (fbErr.code === 'auth/too-many-requests') {
          errorMsg = 'Too many failed login attempts. Please try again later.';
        } else if (fbErr.code === 'auth/network-request-failed') {
          errorMsg = 'Network error. Please check your internet connection.';
        } else if (fbErr.message) {
          errorMsg = fbErr.message;
        }
        throw new Error(errorMsg);
      }
    }

    throw new Error('Firebase Authentication is not configured in .env file.');
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
