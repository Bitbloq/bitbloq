import { useEffect } from "react";
import cookie from "cookie";
import { NextApiRequest } from "next";
import { flags } from "../config";

interface ISession {
  token: string;
  time: number;
}

const {
  RENEW_TOKEN_SECONDS,
  TOKEN_DURATION_MINUTES,
  TOKEN_WARNING_SECONDS
}: any = flags;
const CHECK_TOKEN_MS = 500;

const getSession = (
  tempSession?: string,
  req?: NextApiRequest
): ISession | null => {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  );

  const sessionString = tempSession
    ? cookies[`session-${tempSession}`]
    : cookies.session;

  if (!sessionString) {
    return null;
  }

  const session = JSON.parse(sessionString);

  if (Date.now() - session.time > TOKEN_DURATION_MINUTES * 60000) {
    if (session.token) {
      triggerEvent({ tempSession, event: "expired" });
      setSession({ token: "", time: 0 }, tempSession);
    }
    return null;
  }

  return session;
};

const setSession = (session?: ISession, tempSession?: string) => {
  const sessionString = JSON.stringify(session);
  if (tempSession) {
    document.cookie = cookie.serialize(
      `session-${tempSession}`,
      sessionString,
      {
        sameSite: true,
        path: "/"
      }
    );
  } else {
    document.cookie = cookie.serialize("session", sessionString, {
      sameSite: true,
      path: "/",
      maxAge: TOKEN_DURATION_MINUTES * 60 + RENEW_TOKEN_SECONDS
    });
  }
};

export const getToken = (
  tempSession?: string,
  req?: NextApiRequest
): string | null => {
  const session = getSession(tempSession, req);
  return session ? session.token : null;
};

export const setToken = (token: string, tempSession?: string) => {
  setSession({ token, time: token ? Date.now() : 0 }, tempSession);
  triggerEvent({ tempSession, event: "new-token", data: token });
};

export const shouldRenewToken = (tempSession?: string): boolean => {
  const session = getSession(tempSession);
  return session
    ? Date.now() - session.time > RENEW_TOKEN_SECONDS * 1000 &&
        Date.now() - session.time < TOKEN_DURATION_MINUTES * 60000
    : false;
};

export interface ISessionEvent {
  event: string;
  tempSession?: string;
  error?: any;
  remainingSeconds?: number;
  data?: any;
}

export type SessionCallback = (event: ISessionEvent) => any;

const channel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("bitbloq-session")
    : null;

const triggerEvent = (event: ISessionEvent) => {
  if (channel) {
    channel.postMessage(event);
  }
};

export const onSessionError = (error: any, tempSession?: string) => {
  triggerEvent({ tempSession, error, event: "error" });
};

export const watchSession = (tempSession?: string) => {
  return setInterval(() => {
    const session = getSession(tempSession);
    if (session && session.token) {
      const elapsedSeconds = Math.floor((Date.now() - session.time) / 1000);
      const remainingSeconds = TOKEN_DURATION_MINUTES * 60 - elapsedSeconds;
      if (remainingSeconds < TOKEN_WARNING_SECONDS) {
        triggerEvent({
          remainingSeconds,
          tempSession,
          event: "expiration-warning"
        });
      }
    }
  }, CHECK_TOKEN_MS);
};

export const useSessionEvent = (
  eventName: string,
  callback: SessionCallback,
  tempSession?: string
) => {
  useEffect(() => {
    const eventChannel = new BroadcastChannel("bitbloq-session");
    eventChannel.onmessage = e => {
      const event = e.data as ISessionEvent;
      if (
        eventName === event.event &&
        (!event.tempSession || event.tempSession === tempSession)
      ) {
        callback(event);
      }
    };

    return () => {
      eventChannel.close();
    };
  }, []);
};
