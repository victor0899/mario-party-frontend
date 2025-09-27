# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with hot reloading
- `pnpm build` - Build for production (runs TypeScript compilation then Vite build)
- `pnpm lint` - Run ESLint on the codebase
- `pnpm preview` - Preview production build locally

## Architecture Overview

This is a React + TypeScript + Vite frontend application for a Mario Party-style game tracking system. The app manages users, groups, games, and scores with the following key architectural patterns:

### Feature-Based Architecture
- **Feature modules** organized by domain in `src/features/`: `auth`, `games`, `groups`, `leaderboard`
- Each feature contains: `components`, `hooks`, `services`, `types`, `schemas` directories
- **Shared resources** in `src/shared/`: common components, utilities, services, and types
- **App-level** configuration in `src/app/`: global stores and application setup

### Backend Integration
- **Supabase** as the backend service (not REST API)
- Supabase client configured in `src/shared/lib/supabase.ts`
- Environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Authentication, database operations, and real-time updates handled through Supabase
- Legacy API client in `src/shared/services/client.ts` may still exist but Supabase is primary

### State Management
- **Zustand** for global state management
- Authentication state in `src/app/store/useAuthStore.ts` with Supabase integration
- Groups state in `src/app/store/useGroupsStore.ts`
- Each feature module may have additional hooks for local state management

### Authentication System
- **Supabase Auth** for user authentication
- Google OAuth integration supported
- Profile completion flow for new users
- `ProfileGuard` component ensures users complete their profiles
- Routes protected with `ProtectedRoute` wrapper component

### Routing Structure
- Routes: Home (`/`), Auth (`/auth`), Dashboard (`/dashboard`), Groups management, Game creation, Leaderboards
- Legacy login/register routes redirect to `/auth`
- All authenticated routes require profile completion

### Styling & Design System
- **TailwindCSS v3** for styling with Mario Party themed color palette
- Custom design tokens in `src/design-system/`
- Mario-themed colors, fonts (Fredoka One), and animations
- Shared UI components in `src/shared/components/ui/`
- Layout components in `src/shared/components/layout/`

## Data Models
Core entities managed by the application:
- **User/Profile**: User authentication and profile information via Supabase
- **Group**: Collections of users who play games together
- **Game**: Individual game sessions within a group
- **Score**: Points and winner status for each user in a game
- **LeaderboardEntry**: Aggregated statistics for ranking users

## Development Notes

- No test framework is currently configured
- Uses pnpm as package manager
- TypeScript configuration split between `tsconfig.app.json` (app code) and `tsconfig.node.json` (build tools)
- Toast notifications using `react-hot-toast`
- Form validation using `yup` schemas