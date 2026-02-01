import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
      bio: '',
      skills: [],
      reputation: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      online: true
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update online status
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      online: true,
      lastSeen: serverTimestamp()
    }, { merge: true });

    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logOut = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Update online status
      await setDoc(doc(db, 'users', user.uid), {
        online: false,
        lastSeen: serverTimestamp()
      }, { merge: true });
    }
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
};