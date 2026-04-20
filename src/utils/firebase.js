import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app = null;
let analytics = null;
let auth = null;
let db = null;

// Only initialize if we have the minimum required config so the local demo doesn't crash
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'demo_key') {
  try {
    app = initializeApp(firebaseConfig);
    
    // Initialize Analytics and log app payload
    analytics = getAnalytics(app);
    logEvent(analytics, 'app_loaded');
    
    // Initialize Auth and sign in anonymously immediately
    auth = getAuth(app);
    signInAnonymously(auth).catch((error) => {
      console.warn('Anonymous auth failed. Using local state.', error);
    });

    // Initialize Firestore for user state persistence
    db = getFirestore(app);
    
    console.log('Firebase Services Initialized (Auth, Analytics, Firestore)');
    console.info("Firestore + Auth + Analytics initialized");
  } catch (err) {
    console.error('Firebase initialization error', err);
  }
} else {
  console.log('Firebase running in DEMO mode (Services mocked)');
}

export const trackRoute = () => {
  if (analytics) logEvent(analytics, "route_computed");
};

export const trackAI = () => {
  if (analytics) logEvent(analytics, "ai_used");
};

/**
 * Saves user preferences to Firestore. If offline or in demo mode, mocks success.
 */
export const saveUserPreferences = async (userId, preferences) => {
  if (db && userId) {
    try {
      await setDoc(doc(db, 'users', userId), preferences, { merge: true });
      return true;
    } catch (error) {
      console.warn("Firestore save failed, falling back to local state.", error);
      return true;
    }
  }
  // In demo mode or missing keys, act as a transparent mock
  return true;
};

/**
 * Retrieves user preferences from Firestore.
 */
export const getUserPreferences = async (userId) => {
  if (db && userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (e) {
      console.warn("Firestore read failed, falling back to local state.", e);
      return null;
    }
  }
  return null;
};

export { app, analytics, auth, db };
