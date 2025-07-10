# ImageLogger - Dependencies List

This document outlines all project dependencies. For installation, use `npm install` as dependencies are managed through package.json.

## Core Framework Dependencies

### Runtime & Build Tools
- **express** (^4.18.2) - Web application framework
- **typescript** (^5.0.0) - TypeScript compiler and type system
- **vite** (^4.0.0) - Build tool and development server
- **tsx** (^3.12.0) - TypeScript execution for development
- **esbuild** (^0.18.0) - Fast JavaScript bundler

### Frontend Framework
- **react** (^18.2.0) - UI component library
- **react-dom** (^18.2.0) - React DOM renderer
- **wouter** (^2.11.0) - Lightweight client-side routing
- **@tanstack/react-query** (^4.29.0) - Server state management and caching

## UI & Styling Dependencies

### Component Libraries
- **@radix-ui/react-dialog** - Accessible dialog components
- **@radix-ui/react-button** - Accessible button components
- **@radix-ui/react-select** - Accessible select components
- **@radix-ui/react-toast** - Toast notification components
- **@radix-ui/react-tooltip** - Tooltip components
- **@radix-ui/react-card** - Card layout components

### Styling & Icons
- **tailwindcss** (^3.3.0) - Utility-first CSS framework
- **@tailwindcss/typography** - Typography plugin for Tailwind
- **lucide-react** (^0.263.1) - Beautiful icon library
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Merge Tailwind classes efficiently
- **tailwindcss-animate** - Animation utilities

## Backend Dependencies

### File Handling & Utilities
- **multer** (^1.4.5) - Multipart form data (file upload) handling
- **nanoid** (^4.0.2) - URL-safe unique ID generator
- **zod** (^3.21.0) - TypeScript-first schema validation

### Database & ORM
- **drizzle-orm** (^0.28.0) - Type-safe SQL ORM
- **drizzle-kit** - Drizzle ORM CLI tools
- **drizzle-zod** - Zod integration for Drizzle schemas
- **@neondatabase/serverless** - Serverless PostgreSQL driver

## Development Dependencies

### Type Definitions
- **@types/node** (^20.0.0) - Node.js type definitions
- **@types/express** (^4.17.17) - Express framework types
- **@types/multer** (^1.4.7) - Multer file upload types
- **@types/react** (^18.2.0) - React type definitions
- **@types/react-dom** (^18.2.0) - React DOM type definitions

### Development Tools
- **@vitejs/plugin-react** - Vite React plugin
- **autoprefixer** - CSS vendor prefix automation
- **postcss** - CSS transformation tool

## Form & Input Handling

### Form Management
- **react-hook-form** - Performant forms with easy validation
- **@hookform/resolvers** - Validation library resolvers for react-hook-form
- **input-otp** - One-time password input component
- **react-day-picker** - Date picker component

### UI Enhancement
- **framer-motion** - Animation library for React
- **embla-carousel-react** - Carousel/slider component
- **react-resizable-panels** - Resizable panel layouts
- **vaul** - Drawer/modal component library

## Chart & Data Visualization

### Charts & Analytics
- **recharts** - Composable charting library
- **date-fns** - Modern JavaScript date utility library

## Session & Storage

### Session Management
- **express-session** - Express session middleware
- **connect-pg-simple** - PostgreSQL session store
- **memorystore** - Memory-based session store

## Installation Commands

```bash
# Install all dependencies
npm install

# Install development dependencies only
npm install --only=dev

# Install production dependencies only  
npm install --only=production

# Update all dependencies
npm update

# Audit dependencies for security issues
npm audit
```

## Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit

# Database operations
npx drizzle-kit generate
npx drizzle-kit push
```

## Production Deployment

For production deployment, ensure these dependencies are installed:
- Node.js 18+ runtime
- PostgreSQL database (optional - can use in-memory storage)
- File system access for image uploads
- Environment variables configured (DATABASE_URL, etc.)

## Compatibility

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Browser compatibility**: Modern browsers supporting ES2020
- **Database**: PostgreSQL 12+ (optional)