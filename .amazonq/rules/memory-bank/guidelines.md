# Development Guidelines

## Code Quality Standards

### Formatting and Structure
- **TypeScript strict mode**: All files use TypeScript with explicit type annotations
- **Functional components**: React components use functional style with hooks (no class components)
- **Named exports**: Components and utilities use named exports for better tree-shaking
- **File organization**: One primary component per file with related sub-components
- **Import ordering**: External imports first, then internal imports with `@/` alias

### Naming Conventions
- **Components**: PascalCase (e.g., `OrdersPanel`, `WebOrdersPanel`, `SidebarProvider`)
- **Hooks**: camelCase with `use` prefix (e.g., `useDatabase`, `useSidebar`, `useOrders`)
- **Interfaces**: PascalCase with descriptive names (e.g., `WebOrder`, `OrdersPanelProps`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `SIDEBAR_COOKIE_NAME`, `SIDEBAR_WIDTH`)
- **Functions**: camelCase with descriptive verb-noun pattern (e.g., `loadWebOrders`, `updateOrderStatus`)
- **State variables**: camelCase descriptive names (e.g., `webOrders`, `showTrackingInfo`)

### Code Documentation
- **Inline comments**: Used sparingly, only for complex logic or business rules
- **JSDoc comments**: Not heavily used; code is self-documenting through clear naming
- **Type annotations**: Comprehensive TypeScript types serve as documentation

## Architectural Patterns

### Component Patterns

#### Compound Component Pattern
Used extensively in UI library (sidebar.tsx):
```typescript
// Provider wraps children with context
<SidebarProvider>
  <Sidebar>
    <SidebarHeader />
    <SidebarContent />
    <SidebarFooter />
  </Sidebar>
</SidebarProvider>
```

#### Container/Presenter Pattern
Business logic separated from presentation:
- Container components handle data fetching and state management
- Presenter components receive props and render UI
- Example: `OrdersPanel` manages state, delegates rendering to sub-components

#### Custom Hook Pattern
Data access and business logic encapsulated in hooks:
```typescript
// Pattern: useEntity returns CRUD operations
export const useOrders = () => {
  const [orders, setOrders] = useRealtime<Order[]>('cafe-connect-orders', []);
  
  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    // Implementation
  };
  
  return { orders, addOrder, updateOrder, deleteOrder };
};
```

### State Management Patterns

#### Local State with useState
For component-specific UI state:
```typescript
const [showNewOrderForm, setShowNewOrderForm] = useState(false);
const [selectedTab, setSelectedTab] = useState("todos");
```

#### Custom Hooks for Shared State
Domain-specific state managed through custom hooks:
- `useDatabase` - Database operations
- `useRealtime` - Real-time synchronization
- `useSidebar` - Sidebar state management

#### LocalStorage Persistence
Direct localStorage usage for data persistence:
```typescript
const orders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
localStorage.setItem('ccpservices-web-orders', JSON.stringify(updatedOrders));
```

#### Event-Driven Updates
Custom events for cross-component communication:
```typescript
window.dispatchEvent(new CustomEvent('dataChanged', { 
  detail: { key: 'cafe-connect-orders', data: existingOrders } 
}));
```

### Data Flow Patterns

#### Optimistic Updates
Update UI immediately, then persist:
```typescript
const updatedOrders = orders.map(order => 
  order.id === id ? { ...order, ...updates } : order
);
setOrders(updatedOrders);
db.saveOrders(updatedOrders);
```

#### Polling for Real-Time Updates
Regular intervals to check for changes:
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await fetch('/api/orders');
    const apiOrders = await response.json();
    // Process updates
  }, 2000);
  
  return () => clearInterval(interval);
}, []);
```

#### Lazy Loading
Dynamic imports for code splitting:
```typescript
(async () => {
  const { reportsDatabase } = await import('@/lib/database-reports');
  reportsDatabase.addTransaction(data);
})();
```

## Common Implementation Patterns

### Error Handling
```typescript
try {
  // Operation
  toast.success('Success message');
} catch (error) {
  console.error('Error context:', error);
  toast.error('User-friendly error message');
}
```

### Form Handling
Controlled components with inline handlers:
```typescript
<form onSubmit={(e) => {
  e.preventDefault();
  // Handle submission
}}>
  <input 
    type="email" 
    required
    style={{ /* inline styles */ }}
  />
</form>
```

### Conditional Rendering
Multiple patterns used:
```typescript
// Early return pattern
if (!user) {
  return <LoginScreen />;
}

// Ternary operator
{showTrackingInfo ? <OrderTrackingInfo /> : null}

// Logical AND
{order.status === 'pronto' && (
  <Button onClick={handleCheckout}>Checkout</Button>
)}
```

### List Rendering
Map with unique keys:
```typescript
{orders.map((order) => (
  <Card key={order.id}>
    {/* Order content */}
  </Card>
))}
```

## Internal API Usage

### Database Operations
```typescript
// Import database module
import { db } from '@/lib/database';
import { ordersDatabase } from '@/lib/orders-database';

// CRUD operations
const orders = ordersDatabase.getAllOrders();
const newOrder = ordersDatabase.createOrder(orderData);
ordersDatabase.updateOrderStatus(orderId, newStatus);
```

### Toast Notifications
```typescript
import { toast } from 'sonner';

toast.success('Operation successful');
toast.error('Operation failed');
```

### UI Components
```typescript
// Import from shadcn-ui components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Usage with variants
<Button variant="pdv" size="sm">Action</Button>
<Badge variant="success">Status</Badge>
```

### Custom Hooks
```typescript
// Import and use custom hooks
import { useOrders, useProducts } from '@/hooks/useDatabase';

const { orders, addOrder, updateOrder } = useOrders();
const { products } = useProducts();
```

### Styling with Tailwind
```typescript
// Utility classes for styling
<div className="p-6 space-y-6">
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      {/* Content */}
    </CardHeader>
  </Card>
</div>

// Conditional classes with cn utility
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)} />
```

## Frequently Used Code Idioms

### ID Generation
```typescript
// Timestamp-based IDs
id: Date.now().toString()

// Composite IDs with random suffix
id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Order number format
id: `PED-${Date.now().toString().slice(-6)}`
```

### Date Formatting
```typescript
// ISO string for storage
createdAt: new Date().toISOString()

// Localized display
new Date(order.createdAt).toLocaleString('pt-BR')

// Time only
new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
```

### Array Immutability
```typescript
// Add item
const updated = [...items, newItem];

// Update item
const updated = items.map(item => 
  item.id === id ? { ...item, ...updates } : item
);

// Remove item
const updated = items.filter(item => item.id !== id);
```

### Object Spreading
```typescript
// Merge objects
const newOrder = {
  ...orderData,
  id: generateId(),
  createdAt: new Date().toISOString()
};

// Conditional properties
const order = {
  ...baseOrder,
  ...(hasDelivery && { delivery: deliveryData })
};
```

### Type Omission
```typescript
// Omit auto-generated fields from input types
const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
  // Implementation
};
```

## Popular Annotations and Decorators

### React Component Types
```typescript
// Functional component with props
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div />;
};

// forwardRef for ref forwarding
const Component = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} {...props} />;
  }
);
Component.displayName = "Component";
```

### Type Assertions
```typescript
// Type casting
const data = JSON.parse(stored) as Order[];

// Const assertions for literal types
const statusMap = {
  'pending': { label: 'Pending', variant: 'secondary' as const }
};
```

### Generic Types
```typescript
// Generic hook
const [data, setData] = useRealtime<Order[]>('key', []);

// Generic function
function processItems<T>(items: T[]): T[] {
  return items;
}
```

## Best Practices

### Performance
- Use `React.useMemo` for expensive computations
- Use `React.useCallback` for stable function references
- Implement cleanup in `useEffect` return functions
- Avoid inline object/array creation in render

### Accessibility
- Include `aria-label` for icon-only buttons
- Use semantic HTML elements
- Provide `sr-only` text for screen readers

### Security
- Sanitize user input before storage
- Use environment variables for sensitive data
- Validate data from external sources

### Testing
- Test files co-located with source (`.test.tsx`)
- Use descriptive test names
- Mock external dependencies

### Code Organization
- Group related functionality in modules
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use barrel exports for cleaner imports
