import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
vi.stubEnv('VITE_API_BASE_URL', 'https://test-api.kiddonect.com');
vi.stubEnv('VITE_COGNITO_USER_POOL_ID', 'us-east-1_TEST123');
vi.stubEnv('VITE_COGNITO_CLIENT_ID', 'test-client-id');
vi.stubEnv('VITE_SENTRY_DSN_WEB', '');

// Mock AWS Amplify
vi.mock('aws-amplify/auth', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  fetchAuthSession: vi.fn(() => Promise.resolve({
    tokens: {
      idToken: { toString: () => 'test-token' }
    }
  })),
  getCurrentUser: vi.fn(),
}));

// Mock Sentry
vi.mock('./config/sentry', () => ({
  initSentry: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
