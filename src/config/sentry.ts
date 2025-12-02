import * as Sentry from '@sentry/react';

export function initSentry() {
  // Only initialize if DSN is provided
  const dsn = import.meta.env.VITE_SENTRY_DSN_WEB;

  if (!dsn) {
    console.log('Sentry DSN not provided, skipping initialization');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE || 'development',

    // Performance Monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Performance monitoring sample rate
    tracesSampleRate: 0.1, // 10% of transactions

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Release tracking
    release: import.meta.env.VITE_GIT_COMMIT || 'unknown',

    // Don't send errors in development
    enabled: import.meta.env.MODE === 'production',

    // Before send hook - filter out sensitive data
    beforeSend(event) {
      // Remove Authorization headers
      if (event.request?.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.authorization;
      }

      return event;
    },
  });

  console.log('Sentry initialized for web app');
}
