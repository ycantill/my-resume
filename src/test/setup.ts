// Runs before every unit/component test file.
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { useAppStore } from '../store/useAppStore';

// The Firebase Auth SDK needs a real API key and network; no test signs in, so
// the module is replaced by inert stand-ins (path is relative to this file)
vi.mock('../firebase-auth', () => ({
  auth: {},
  createRecaptchaVerifier: vi.fn(),
  sendPhoneCode: vi.fn(),
  confirmPhoneCode: vi.fn(),
  signOutUser: vi.fn(),
  isAuthConfigured: () => false,
  getFreshIdToken: vi.fn(async () => null),
}));

afterEach(() => {
  cleanup();
  useAppStore.getState().reset();
  vi.restoreAllMocks();
});
