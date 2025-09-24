// Auth module exports following EngraveWheels pattern

// Types
export * from './types';

// Services
export * from './services/auth.api';

// Schemas
export * from './schemas';

// Components
export * from './components/AuthForm';
export * from './components/SocialAuth';

// Store
export { useAuthStore } from './store';

// Main hooks (use these in new code)
export { default as useAuthNew } from './hooks/use-auth';

// Legacy exports for backward compatibility
export * from './hooks/useAuth';
export * from './hooks/useAuthForm';
export * from './services/authService';