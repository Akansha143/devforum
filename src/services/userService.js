import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from './firebase';

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };

    await updateDoc(userRef, updateData);

    // Update Firebase Auth profile if displayName or photoURL changed
    if (data.displayName || data.photoURL) {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
        photoURL: data.photoURL
      });
    }

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUserReputation = async (userId, points) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentReputation = userDoc.data().reputation || 0;
      await updateDoc(userRef, {
        reputation: currentReputation + points,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating reputation:', error);
  }
};