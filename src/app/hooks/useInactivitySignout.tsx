// src/app/hooks/useInactivityLogout.ts
import { useEffect } from 'react';
import useAuth from './useAuth'; // Your authentication hook

const useInactivitySignout = (timeout: number) => {
  const { signOut } = useAuth(); // Get your sign-out function

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        signOut(); // Call sign-out after the timeout
      }, timeout);
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('wheel', resetTimer); // Add mouse wheel activity
    window.addEventListener('touchstart', resetTimer); // Add touch activity for mobile

    // Initialize the timer
    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('wheel', resetTimer); // Cleanup
      window.removeEventListener('touchstart', resetTimer); // Cleanup
    };
  }, [signOut, timeout]);
};

export default useInactivitySignout;
