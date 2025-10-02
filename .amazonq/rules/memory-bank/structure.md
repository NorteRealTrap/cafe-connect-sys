# Project Structure & Architecture

## Directory Organization

### Root Level Configuration
- **package.json**: Main project dependencies and scripts
- **vite.config.ts**: Vite build configuration
- **tailwind.config.ts**: Tailwind CSS styling configuration
- **tsconfig.json**: TypeScript compiler settings
- **Dockerfile & docker-compose.yml**: Container deployment setup

### Source Code Structure (`/src`)

#### Core Application
- **main.tsx**: Application entry point
- **App.tsx**: Main application component
- **SimpleApp.tsx**: Simplified application variant
- **index.css**: Global styles and Tailwind imports

#### Components Architecture (`/src/components`)
Modular component organization by feature domain:

**Business Logic Components**
- `analytics/`: Business metrics and reporting components
- `business/`: Core business logic and operations
- `orders/`: Order management and processing
- `payments/`: Payment processing and transactions
- `inventory/`: Stock management and tracking
- `reports/`: Financial and operational reporting

**User Interface Components**
- `ui/`: Reusable UI components (buttons, modals, forms)
- `dashboard/`: Main dashboard and navigation
- `menu/`: Menu display and management
- `tables/`: Table management interface
- `settings/`: Configuration and preferences

**Operational Components**
- `auth/`: Authentication and authorization
- `delivery/`: Delivery tracking and management
- `notifications/`: Alert and messaging system
- `communication/`: Internal communication tools

#### Utilities & Services (`/src/lib`)
- **database.ts**: Core database operations
- **orders-database.ts**: Order-specific database functions
- **database-reports.ts**: Reporting database queries
- **auth.ts**: Authentication services
- **analytics.ts**: Analytics and tracking
- **utils.ts**: Common utility functions

#### Custom Hooks (`/src/hooks`)
- **useDatabase.ts**: Database interaction hook
- **use-toast.ts**: Toast notification management
- **use-mobile.tsx**: Mobile device detection

#### Pages & Routing (`/src/pages`)
- **Index.tsx**: Landing/home page
- **Dashboard.tsx**: Main dashboard interface
- **NotFound.tsx**: 404 error page

### Deployment & Infrastructure

#### Multi-Platform Deployment
- **Netlify**: `/netlify` functions and configuration
- **Vercel**: `.vercel/` deployment settings
- **Docker**: Container-based deployment option

#### CI/CD Pipeline
- **GitHub Actions**: `.github/workflows/` for automated builds
- **Build Scripts**: Automated testing and deployment

## Architectural Patterns

### Component Architecture
- **Feature-based organization**: Components grouped by business domain
- **Atomic design principles**: Reusable UI components in `/ui`
- **Container/Presenter pattern**: Separation of logic and presentation

### Data Management
- **Custom hooks**: Centralized data fetching and state management
- **Local storage**: Offline capability and data persistence
- **Real-time updates**: Live synchronization across components

### Routing & Navigation
- **React Router**: Client-side routing with protected routes
- **Nested layouts**: Consistent UI structure across pages
- **Mobile-first navigation**: Responsive design patterns

## Core Relationships
- **Database Layer** → **Custom Hooks** → **Components** → **Pages**
- **Authentication** → **Protected Routes** → **Feature Components**
- **Utilities** → **All Components** (shared functionality)
- **UI Components** → **Feature Components** (reusable interface elements)