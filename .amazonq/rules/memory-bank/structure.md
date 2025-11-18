# Project Structure

## Directory Organization

### Root Configuration
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript compiler settings
- `tailwind.config.ts` - Tailwind CSS configuration
- `netlify.toml` - Netlify deployment configuration
- `vercel.json` - Vercel deployment configuration
- `docker-compose.yml` / `Dockerfile` - Container configuration

### Source Code (`/src`)

#### Components (`/src/components`)
Modular UI components organized by feature domain:
- `analytics/` - Analytics and reporting components
- `auth/` - Authentication and login components
- `business/` - Business management components
- `categories/` - Product category management
- `checkout/` - Checkout and payment flow
- `communication/` - Messaging and notifications
- `config/` - Configuration management
- `dashboard/` - Main dashboard views
- `debug/` - Development and debugging tools
- `delivery/` - Delivery management
- `inventory/` - Stock and inventory tracking
- `menu/` - Menu item management
- `notifications/` - Notification system
- `operations/` - Operational tools
- `orders/` - Order processing and management
- `payments/` - Payment processing
- `reports/` - Report generation
- `settings/` - Application settings
- `status/` - Status monitoring
- `tables/` - Table management for dine-in
- `ui/` - Reusable UI primitives (shadcn-ui)
- `users/` - User management
- `web-orders/` - Web order interface
- `PDVLayout.tsx` - Main POS layout component

#### Hooks (`/src/hooks`)
Custom React hooks for shared logic:
- `useDatabase.ts` - Database operations hook
- `use-toast.ts` - Toast notification hook
- `use-mobile.tsx` - Mobile device detection

#### Library (`/src/lib`)
Core business logic and utilities:
- `database.ts` - Main database interface
- `orders-database.ts` - Order-specific database operations
- `database-reports.ts` - Reporting database queries
- `auth.ts` - Authentication logic
- `sync.ts` - Data synchronization
- `order-sync.ts` - Order synchronization
- `realtime.ts` - Real-time updates
- `persistence.ts` - Local data persistence
- `storage-manager.ts` - Storage management
- `analytics.ts` - Analytics tracking
- `financial.ts` - Financial calculations
- `utils.ts` - General utilities

#### Pages (`/src/pages`)
Top-level page components:
- `Dashboard.tsx` - Main dashboard page
- `Index.tsx` - Landing/home page
- `WebOrder.tsx` - Customer order page
- `OrderTracking.tsx` - Order tracking page
- `NotFound.tsx` - 404 error page

#### Entry Points
- `main.tsx` - Application entry point
- `App.tsx` - Main application component
- `SimpleApp.tsx` - Simplified application variant
- `index.css` - Global styles

### API (`/api` and `/netlify/functions`)
Serverless functions for backend operations:
- `orders.js` - Order API endpoints
- `status.js` - Status check endpoints
- `auth.ts` - Authentication endpoints

### Public Assets (`/public`)
Static files served directly:
- `favicon.ico` - Site icon
- `placeholder.svg` - Placeholder images
- `robots.txt` - Search engine directives

### MCP Server (`/MCPServer`)
Model Context Protocol server configuration for AI integration

## Architectural Patterns

### Component Architecture
- **Feature-based organization**: Components grouped by business domain
- **Atomic design**: UI components built from primitives (shadcn-ui)
- **Container/Presenter pattern**: Separation of logic and presentation

### Data Flow
- **React Query**: Server state management with caching
- **Custom hooks**: Encapsulated data access logic
- **Local-first**: Offline capability with sync

### State Management
- **React hooks**: Local component state
- **Context API**: Shared application state
- **Persistence layer**: IndexedDB/LocalStorage for offline data

### Routing
- **React Router**: Client-side routing
- **Page-based structure**: Clear page hierarchy

### Styling
- **Tailwind CSS**: Utility-first styling
- **CSS Modules**: Component-scoped styles
- **Theme system**: Dark/light mode support

## Core Component Relationships

```
App.tsx
├── PDVLayout.tsx (Main POS Interface)
│   ├── Dashboard (Analytics & Overview)
│   ├── OrdersPanel (Order Management)
│   ├── MenuPanel (Menu Management)
│   ├── InventoryPanel (Stock Management)
│   └── SettingsPanel (Configuration)
├── WebOrder.tsx (Customer Interface)
└── OrderTracking.tsx (Status Tracking)

Data Layer
├── useDatabase (Database Hook)
├── lib/database.ts (Core DB)
├── lib/orders-database.ts (Orders)
├── lib/sync.ts (Synchronization)
└── lib/persistence.ts (Local Storage)
```

## Build and Deployment

### Development
- Vite dev server with HMR
- TypeScript compilation
- ESLint for code quality

### Production
- Vite production build
- Netlify/Vercel deployment
- Docker containerization support
- Serverless functions deployment
