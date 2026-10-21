import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { AUTH_STORAGE_KEY } from '../lib/demoAuth';
import { resetAuthStoreForTests } from '../stores/authStore';

afterEach(() => {
  cleanup();
  localStorage.removeItem(AUTH_STORAGE_KEY);
  resetAuthStoreForTests();
});
