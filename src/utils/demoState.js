import { useState, useEffect } from 'react';

const STORAGE_KEY = 'stadium-demo-state';

const defaultState = {
  phase: 'Halftime',
  isEmergency: false,
  emergencyType: null, // 'Fire Alarm' | 'Security Incident'
};

export function useDemoState() {
  const [demoState, setDemoState] = useState(() => {
    if (typeof window === 'undefined') return defaultState;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    // Listener for cross-tab synchronization
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        setDemoState(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateDemoState = (updates) => {
    setDemoState((prev) => {
      const next = { ...prev, ...updates };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return [demoState, updateDemoState];
}
