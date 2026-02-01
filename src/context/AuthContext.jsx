import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { signIn, signUp, logOut } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Subscribe to user data
        const unsubscribeUser = onSnapshot(doc(db, 'users', user.uid), (doc) => {
          if (doc.exists()) {
            setUserData({ id: doc.id, ...doc.data() });
          }
          setLoading(false);
        });

        return () => unsubscribeUser();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const login = async (email, password) => {
    return await signIn(email, password);
  };

  const signup = async (email, password, displayName) => {
    return await signUp(email, password, displayName);
  };

  const logout = async () => {
    return await logOut();
  };

  const value = {
    currentUser,
    userData,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}