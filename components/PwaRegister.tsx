'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    window.navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('Service Worker registered', reg.scope);
      })
      .catch((err) => {
        console.warn('Service Worker registration failed', err);
      });
  }, []);
  return null;
}
