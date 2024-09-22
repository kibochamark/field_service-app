'use client';
import { signOut, useSession } from "next-auth/react";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";

export interface AutoLogoutProviderProps {
  timeoutMs?: number;
  timeoutCheckMs?: number;
  debug?: boolean;
  requireSession?: boolean;
}

type WindowActivityEvent = keyof WindowEventMap;

export function AutoLogoutProvider({
  timeoutMs = +(process.env.NEXT_PUBLIC_TIME_OUT_MS || 600000), // Inactivity time
  timeoutCheckMs = +(process.env.NEXT_PUBLIC_TIME_OUT_CHECK_MS || 70000), // Time out to check
  debug = false,
  requireSession = false,
  children
}: PropsWithChildren<AutoLogoutProviderProps>) {
  const [lastActivity, setLastActivity] = useState(new Date().getTime());
  const { data: session, status } = useSession({ required: requireSession });
  const _storageKey = "_lastActivity";

  function storage() {
    return global.window !== undefined ? window.localStorage : null;
  }

  const parseLastActivityString = useCallback((activityStr?: string | null) => {
    if (!activityStr) return null;
    const lastActivity = +activityStr;
    const now = activity();
    if (lastActivity == null || lastActivity > now || lastActivity <= 0 || isNaN(lastActivity)) {
      return null;
    }
    return lastActivity;
  }, []);

  const initLastActivity = useCallback(() => {
    const now = activity();
    const lastActivityStr = storage()?.getItem(_storageKey);
    const lastActivity = parseLastActivityString(lastActivityStr);
    return lastActivity == null ? now : lastActivity;
  }, [parseLastActivityString]);

  useEffect(() => {
    if (!lastActivity) setLastActivity(initLastActivity());
  }, [initLastActivity, lastActivity]);

  function activity() {
    return new Date().getTime();
  }

  const onUserActivity = useCallback(() => {
    const now = activity();
    if (debug) storage()?.setItem(_storageKey, now.toString());
    setLastActivity(now);
  }, [debug]);

  const onStorage = useCallback(({ key, storageArea, newValue }: StorageEvent) => {
    if (key === _storageKey && storageArea === storage()) {
      let lastActivity = parseLastActivityString(newValue);
      if (lastActivity !== null) {
        setLastActivity(lastActivity);
      }
    }
  }, [parseLastActivityString]);

  const isUserInactive = useCallback(() => {
    const now = activity();

    if (status === 'authenticated') {
      const sessionExpiry = new Date(session?.expires).getTime();
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Get the local time as a formatted string (e.g., "12:01:18")
      const localTime = new Intl.DateTimeFormat('en-US', {
        timeZone: userTimezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date());
      
      // Parse the localTime string to extract hours, minutes, and seconds
      const [hours, minutes, seconds] = localTime.split(':').map(Number);
    
      // Create a new Date object and set hours, minutes, and seconds based on localTime
      const now = new Date();
      now.setHours(hours);
      now.setMinutes(minutes);
      now.setSeconds(seconds);
      
      // Convert the updated 'now' to a timestamp
      const localNow = now.getTime();
    
 
    
      if (localNow > sessionExpiry) {
        console.log("session expired");
        signOut().then();
        return true;
      }
    }
    

    if (lastActivity + timeoutMs < now) {
      console.log("session expired due to inactivity");
      signOut().then();
      return true;
    }

    return false;
  }, [lastActivity, session?.expires, status, timeoutMs]);

  const onTimerElapsed = useCallback(() => {
    isUserInactive();
  }, [isUserInactive]);

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated" || timeoutMs === null || isUserInactive()) {
      return;
    }

    const windowEvents: WindowActivityEvent[] = ['focus', 'scroll', 'click', 'mousemove'];

    windowEvents.forEach(eventName => {
      window.addEventListener(eventName, onUserActivity, false);
    });

    window.addEventListener("storage", onStorage, false);

    const intervalId = window.setInterval(onTimerElapsed, timeoutCheckMs);

    return () => {
      windowEvents.forEach(eventName => {
        window.removeEventListener(eventName, onUserActivity, false);
      });

      window.removeEventListener("storage", onStorage, false);

      window.clearInterval(intervalId);
    }
  }, [isUserInactive, onStorage, onTimerElapsed, onUserActivity, status, timeoutCheckMs, timeoutMs]);

  return <>{children}</>;
}
