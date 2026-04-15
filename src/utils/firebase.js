import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getAuth, signInAnonymously } from 'firebase/auth';

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
    
    console.log('Firebase Services Initialized (Auth, Analytics)');
  } catch (err) {
    console.error('Firebase initialization error', err);
  }
} else {
  console.log('Firebase running in DEMO mode (Services mocked)');
}

export { app, analytics, auth };
