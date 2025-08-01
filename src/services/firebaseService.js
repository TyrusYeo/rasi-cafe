import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/config/firebase';

const USERS_COLLECTION = 'users';

// Helper function to check if Firebase is available
const isFirebaseAvailable = () => {
  return typeof window !== 'undefined' && db;
};

// Add a new user
export const addUser = async (userData) => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  try {
    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...userData,
      createdAt: new Date().toISOString(),
      status: 'active',
      matched: false,
      matchCode: null,
      matchedWith: null
    });
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Get all active users
export const getActiveUsers = async () => {
  if (!isFirebaseAvailable()) {
    return [];
  }
  
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error('Error getting active users:', error);
    throw error;
  }
};

// Get all users (for admin)
export const getAllUsers = async () => {
  if (!isFirebaseAvailable()) {
    return [];
  }
  
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Update user status to inactive (logout)
export const logoutUser = async (userId) => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      status: 'inactive'
    });
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};

// Update user match information
export const updateUserMatch = async (userId, matchData) => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      matched: true,
      matchCode: matchData.matchCode,
      matchedWith: matchData.matchedWith
    });
  } catch (error) {
    console.error('Error updating user match:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  if (!isFirebaseAvailable()) {
    return null;
  }
  
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('__name__', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

// Get user statistics
export const getUserStats = async () => {
  if (!isFirebaseAvailable()) {
    return {
      total: 0,
      active: 0,
      matched: 0,
      inactive: 0
    };
  }
  
  try {
    const allUsers = await getAllUsers();
    const stats = {
      total: allUsers.length,
      active: allUsers.filter(user => user.status === 'active').length,
      matched: allUsers.filter(user => user.matched).length,
      inactive: allUsers.filter(user => user.status === 'inactive').length
    };
    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}; 