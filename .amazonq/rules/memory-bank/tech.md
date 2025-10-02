# Technology Stack & Development Setup

## Core Technologies

### Frontend Framework
- **React 18.2.0**: Modern React with hooks and concurrent features
- **TypeScript 5.2.2**: Type-safe JavaScript development
- **Vite 5.0.0**: Fast build tool and development server

### UI & Styling
- **Tailwind CSS 3.3.5**: Utility-first CSS framework
- **shadcn/ui**: High-quality React component library
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide React**: Modern icon library
- **Tailwind Animate**: CSS animations

### State Management & Data
- **React Hook Form 7.48.2**: Form handling and validation
- **Zod 3.22.4**: Schema validation
- **TanStack Query 5.8.4**: Server state management
- **Date-fns 2.30.0**: Date manipulation utilities

### Routing & Navigation
- **React Router DOM 6.20.1**: Client-side routing
- **React Resizable Panels**: Flexible layout components

### Development Tools
- **ESLint 8.53.0**: Code linting and quality
- **TypeScript ESLint**: TypeScript-specific linting rules
- **Autoprefixer**: CSS vendor prefixing
- **PostCSS**: CSS processing

## Build System & Configuration

### Development Commands
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Code linting
npm run preview  # Preview production build
```

### Build Configuration
- **Vite Config**: Modern build tooling with HMR
- **TypeScript Config**: Strict type checking enabled
- **ESLint Config**: React and TypeScript rules
- **Tailwind Config**: Custom design system configuration

### Environment Setup
- **Node.js**: Required runtime (version specified in .nvmrc)
- **npm**: Package management
- **Bun**: Alternative package manager (lockfile present)

## Deployment Platforms

### Multi-Platform Support
- **Netlify**: Serverless functions and edge deployment
- **Vercel**: Edge functions and global CDN
- **Docker**: Containerized deployment option

### Deployment Configuration
- **netlify.toml**: Netlify-specific build settings
- **vercel.json**: Vercel deployment configuration
- **Dockerfile**: Container image definition
- **docker-compose.yml**: Multi-container orchestration

### CI/CD Pipeline
- **GitHub Actions**: Automated build and deployment workflows
- **Build Workflows**: `.github/workflows/build.yml`
- **Deploy Workflows**: `.github/workflows/deploy.yml`

## Database & Backend

### Data Storage
- **Local Storage**: Client-side data persistence
- **Netlify Database**: Cloud database integration
- **Custom Database Layer**: Abstracted data operations

### Authentication
- **Custom Auth System**: User authentication and authorization
- **Netlify Functions**: Serverless authentication endpoints

## Development Dependencies

### Type Definitions
- **@types/react**: React type definitions
- **@types/react-dom**: React DOM type definitions
- **@types/node**: Node.js type definitions

### Build Tools
- **@vitejs/plugin-react**: Vite React plugin
- **autoprefixer**: CSS vendor prefixing
- **postcss**: CSS processing pipeline

### Code Quality
- **eslint-plugin-react-hooks**: React hooks linting
- **eslint-plugin-react-refresh**: React refresh linting
- **@typescript-eslint/parser**: TypeScript ESLint parser

## Component Libraries

### UI Components
- **@radix-ui/react-***: Complete set of accessible UI primitives
- **cmdk**: Command palette component
- **sonner**: Toast notifications
- **vaul**: Drawer/modal components
- **embla-carousel-react**: Carousel components

### Form & Input
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **input-otp**: OTP input component
- **react-day-picker**: Date picker component

### Data Visualization
- **recharts**: Chart and graph components
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility