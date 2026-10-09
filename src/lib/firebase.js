import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';

// Dynamic authDomain resolution to prevent third-party cookie blocking on Firebase Hosting
const getResolvedAuthDomain = () => {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname;
    // When served on Firebase Hosting (*.web.app or *.firebaseapp.com), match current origin
    if (host.endsWith('.web.app') || host.endsWith('.firebaseapp.com')) {
      return host;
    }
  }
  return rawConfig.authDomain || `${rawConfig.projectId}.firebaseapp.com`;
};

// Firebase configuration loaded directly from firebase-applet-config.json
export const firebaseConfig = {
  ...rawConfig,
  authDomain: getResolvedAuthDomain(),
};


// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: getFirestore with databaseId
export const db =
  firebaseConfig.firestoreDatabaseId &&
  firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Error handler conforming to FirestoreErrorInfo
export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate Firestore Connection on initial boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Authentication helpers
export async function loginWithEmail(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (err) {
    // If user not found, attempt creation if appropriate or throw user-friendly error
    throw err;
  }
}

export async function registerWithEmail(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Sign in with Google using a popup
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logOut = () => signOut(auth);
export const logoutUser = logOut;
export const loginWithGoogle = signInWithGoogle;

// Monitor auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("Logged in user UID:", user.uid);
    console.log("Email:", user.email);
  } else {
    // User is signed out
    console.log("No user signed in");
  }
});

// Re-export common Firebase Auth utilities
export {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
};
