import { useEffect, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

/**
 * Owns session hydration and auth-state subscription.
 *
 * UI layers use this to know whether they should show the boot screen,
 * auth flow, or the post-auth organization flow.
 */
export function useSessionController(client: SupabaseClient) {
  const [session, setSession] = useState<Session | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  function clearSession() {
    setSession(null);
    setSessionError(null);
    setIsBooting(false);
  }

  useEffect(() => {
    let isActive = true;

    async function hydrateSession() {
      const { data, error } = await client.auth.getSession();

      if (!isActive) {
        return;
      }

      if (error) {
        setSessionError(error.message);
      }

      setSession(data.session ?? null);
      setIsBooting(false);
    }

    void hydrateSession();

    const {
      data: { subscription }
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!isActive) {
        return;
      }

      setSession(nextSession ?? null);
      setSessionError(null);
      setIsBooting(false);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [client]);

  return {
    session,
    isBooting,
    sessionError,
    clearSession
  };
}
