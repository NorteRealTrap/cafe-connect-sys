# Technology Stack

## Programming Languages
- **TypeScript 5.2.2** - Primary language for type-safe development
- **JavaScript (ES Module)** - For serverless functions and configuration

## Core Framework
- **React 18.2.0** - UI library for component-based architecture
- **React DOM 18.2.0** - React rendering for web

## Build System
- **Vite 5.0.0** - Fast build tool and dev server
- **@vitejs/plugin-react 4.1.1** - React integration for Vite
- **TypeScript Compiler** - Type checking and compilation

## UI Framework and Components
- **shadcn-ui** - Reusable component library built on Radix UI
- **Radix UI** - Unstyled, accessible component primitives:
  - Dialog, Dropdown, Select, Tabs, Toast, Tooltip
  - Accordion, Alert Dialog, Checkbox, Radio Group
  - Navigation Menu, Popover, Scroll Area, Slider
  - And 15+ other primitive components
- **Lucide React 0.294.0** - Icon library
- **Vaul 0.7.9** - Drawer component

## Styling
- **Tailwind CSS 3.3.5** - Utility-first CSS framework
- **tailwindcss-animate 1.0.7** - Animation utilities
- **tailwind-merge 2.0.0** - Merge Tailwind classes
- **class-variance-authority 0.7.0** - Component variants
- **PostCSS 8.4.31** - CSS processing
- **Autoprefixer 10.4.16** - CSS vendor prefixes

## State Management and Data Fetching
- **@tanstack/react-query 5.8.4** - Server state management, caching, and synchronization
- **React Hook Form 7.48.2** - Form state management
- **@hookform/resolvers 3.3.2** - Form validation resolvers
- **Zod 3.22.4** - Schema validation

## Routing
- **React Router DOM 6.20.1** - Client-side routing

## UI Utilities
- **cmdk 0.2.0** - Command menu component
- **date-fns 2.30.0** - Date manipulation
- **react-day-picker 8.9.1** - Date picker component
- **embla-carousel-react 8.0.0-rc22** - Carousel component
- **input-otp 1.2.4** - OTP input component
- **react-resizable-panels 0.0.55** - Resizable panel layouts
- **recharts 2.8.0** - Charting library
- **sonner 1.2.4** - Toast notifications
- **next-themes 0.2.1** - Theme management (dark/light mode)
- **clsx 2.0.0** - Conditional class names

## Development Tools
- **ESLint 8.53.0** - Code linting
- **@typescript-eslint/eslint-plugin 8.38.0** - TypeScript ESLint rules
- **@typescript-eslint/parser 8.38.0** - TypeScript parser for ESLint
- **eslint-plugin-react-hooks 4.6.0** - React Hooks linting
- **eslint-plugin-react-refresh 0.4.4** - React Refresh linting

## Type Definitions
- **@types/node 20.9.0** - Node.js type definitions
- **@types/react 18.2.37** - React type definitions
- **@types/react-dom 18.2.15** - React DOM type definitions
- **@types/prop-types 15.7.15** - PropTypes type definitions

## Deployment Platforms
- **Netlify** - Primary deployment platform with serverless functions
- **Vercel** - Alternative deployment platform
- **Docker** - Containerization support

## Database
- **Neon Database** - PostgreSQL database (via Netlify integration)
- **IndexedDB/LocalStorage** - Client-side persistence

## Development Commands

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts Vite dev server with hot module replacement

### Production Build
```bash
npm run build
```
Creates optimized production build

### Linting
```bash
npm run lint
```
Runs ESLint on the codebase

### Preview Production Build
```bash
npm run preview
```
Preview production build locally

## Node Version
- **Node.js** - Specified in `.nvmrc` file
- **Package Manager** - npm (package-lock.json present)

## Configuration Files
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript base configuration
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.node.json` - Node-specific TypeScript config
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `components.json` - shadcn-ui component configuration
- `.eslintrc.cjs` - ESLint configuration
- `netlify.toml` - Netlify deployment configuration
- `vercel.json` - Vercel deployment configuration
