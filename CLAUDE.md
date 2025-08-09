# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with hot reloading
- `pnpm build` - Build for production (runs TypeScript compilation then Vite build)  
- `pnpm lint` - Run ESLint on the codebase
- `pnpm preview` - Preview production build locally

## Architecture Overview

This is a React + TypeScript + Vite frontend application for a Mario Party-style game tracking system. The app manages users, groups, games, and scores with the following key architectural patterns:

### State Management
- **Zustand** for global state management with persistence
- Authentication state is managed in `src/store/useAuthStore.ts` with localStorage persistence
- Uses Zustand's persist middleware to maintain login state across sessions

### API Layer
- Centralized API client in `src/api/client.ts` with REST methods
- Environment-based API URL configuration (`VITE_API_URL` env var, defaults to `http://localhost:3000/api`)
- Separate API modules for different domains: `users.ts`, `groups.ts`, `games.ts`
- TypeScript interfaces for all API requests/responses in `src/types/api.ts`

### Routing & Authentication
- React Router for client-side routing
- Protected routes using a `ProtectedRoute` wrapper component
- Routes: Home (`/`), Login (`/login`), Register (`/register`), Dashboard (`/dashboard`)
- Authentication redirects handled automatically

### Data Models
Core entities managed by the application:
- **User**: Basic user profile and authentication
- **Group**: Collections of users who play games together  
- **Game**: Individual game sessions within a group
- **Score**: Points and winner status for each user in a game
- **LeaderboardEntry**: Aggregated statistics for ranking users

### Styling
- **TailwindCSS v4** for styling
- **PostCSS** for CSS processing
- Utility-first CSS approach with Tailwind classes
- Custom utility function `cn()` in `src/utils/cn.ts` for conditional class names

## Development Notes

- No test framework is currently configured
- Uses pnpm as package manager
- TypeScript configuration split between `tsconfig.app.json` (app code) and `tsconfig.node.json` (build tools)
- Components directory exists but is currently empty - components are in pages for now