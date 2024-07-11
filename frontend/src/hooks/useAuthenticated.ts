import { useEffect, useState } from 'react';
import validateSessionTokenForUser from '@/utils/session';
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from '@/utils/constants';

function useAuthenticated() {
  const [isAuthd, setIsAuthed] = useState<boolean | null>(null);
  useState(false);
  const [multiUserMode, setMultiUserMode] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      const {
        MultiUserMode,
        RequiresAuth,
        LLMProvider = null,
        VectorDB = null,
      } = await System.keys();

      setMultiUserMode(!!MultiUserMode);

      // Check for the onboarding redirect condition
      if (
        !MultiUserMode &&
        !RequiresAuth && // Not in Multi-user AND no password set.
        !LLMProvider &&
        !VectorDB
      ) {
        setIsAuthed(true);
        return;
      }

      if (!MultiUserMode && !RequiresAuth) {
        setIsAuthed(true);
        return;
      }

      // Single User password mode check
      if (!MultiUserMode && RequiresAuth) {
        const localAuthToken = localStorage.getItem(AUTH_TOKEN);
        if (!localAuthToken) {
          setIsAuthed(false);
          return;
        }

        const isValid = await validateSessionTokenForUser();
        setIsAuthed(isValid);
        return;
      }

      const localUser = localStorage.getItem(AUTH_USER);
      const localAuthToken = localStorage.getItem(AUTH_TOKEN);
      if (!localUser || !localAuthToken) {
        setIsAuthed(false);
        return;
      }

      const isValid = await validateSessionTokenForUser();
      if (!isValid) {
        localStorage.removeItem(AUTH_USER);
        localStorage.removeItem(AUTH_TOKEN);
        localStorage.removeItem(AUTH_TIMESTAMP);
        setIsAuthed(false);
        return;
      }

      setIsAuthed(true);
    };
    validateSession();
  }, []);

  return { isAuthd, multiUserMode };
}

export default useAuthenticated;
