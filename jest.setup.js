import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';

// Mocking localStorage for tests
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  
  // Mocking the fetch API for tests
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ token: 'fake-token', userId: 1 }),
    })
  );

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
  
  
  