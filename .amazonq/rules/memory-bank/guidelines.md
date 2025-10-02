# Development Guidelines & Patterns

## Code Quality Standards

### TypeScript Usage
- **Strict typing**: All components use explicit TypeScript interfaces and types
- **Interface definitions**: Complex props defined as interfaces (e.g., `NewOrderModalProps`, `ReportsPanelProps`)
- **Type safety**: Consistent use of generic types for hooks and state management
- **Optional properties**: Proper use of optional (`?`) and required properties in interfaces

### Import Organization
- **Absolute imports**: Consistent use of `@/` path aliases for internal modules
- **Library imports first**: External libraries imported before internal modules
- **Grouped imports**: Related imports grouped together (UI components, hooks, utilities)
- **Named imports**: Prefer named imports over default imports for clarity

### Component Structure
- **React.forwardRef pattern**: Extensive use for UI components to support ref forwarding
- **Display names**: All forwardRef components have explicit `displayName` properties
- **Compound components**: Complex components broken into sub-components (Sidebar system)
- **Consistent export pattern**: Named exports preferred over default exports

## Architectural Patterns

### Custom Hooks Pattern
- **Database operations**: Centralized in `useDatabase.ts` with separate hooks per entity
- **CRUD operations**: Consistent pattern: `add`, `update`, `delete` functions for each entity
- **State synchronization**: Local state updates followed by database persistence
- **Error handling**: Try-catch blocks with console logging for debugging

### State Management
- **useState initialization**: Initialize with database values using function syntax
- **useEffect for loading**: Separate effect for initial data loading
- **Storage listeners**: Event listeners for cross-tab synchronization
- **Immediate persistence**: State updates immediately persisted to localStorage

### Component Composition
- **Compound component pattern**: Sidebar system demonstrates advanced composition
- **Context providers**: Custom contexts with validation and error boundaries
- **Slot pattern**: Use of Radix UI Slot for flexible component composition
- **Variant-based styling**: CVA (class-variance-authority) for component variants

## UI/UX Patterns

### Styling Conventions
- **Tailwind CSS**: Utility-first approach with consistent spacing and colors
- **CSS custom properties**: Used for dynamic theming (sidebar widths, colors)
- **Responsive design**: Mobile-first approach with responsive breakpoints
- **Design tokens**: Consistent use of semantic color names (sidebar-*, primary, muted-foreground)

### Form Handling
- **Controlled components**: All form inputs use controlled state pattern
- **Validation**: Client-side validation with user-friendly error messages
- **Toast notifications**: Consistent error and success feedback using Sonner
- **Form reset**: Proper cleanup on form submission and modal close

### Modal and Dialog Patterns
- **Radix UI Dialog**: Consistent modal implementation with proper accessibility
- **Two-column layouts**: Complex forms use grid layouts for better organization
- **Overflow handling**: Proper scroll areas for content that exceeds viewport
- **Action buttons**: Consistent placement and styling of primary/secondary actions

## Data Management Patterns

### Database Operations
- **Unique ID generation**: Timestamp-based IDs with random suffixes for uniqueness
- **Optimistic updates**: UI updates immediately, database sync follows
- **Data validation**: Input validation before database operations
- **Consistent naming**: Portuguese field names for business domain, English for technical

### Business Logic
- **Financial calculations**: Proper handling of currency with decimal precision
- **Status management**: Enum-like status values with proper state transitions
- **Date handling**: Consistent ISO string format for dates
- **Inventory tracking**: Automatic status calculation based on stock levels

### Performance Patterns
- **useMemo for calculations**: Expensive calculations memoized with proper dependencies
- **useCallback for handlers**: Event handlers wrapped in useCallback to prevent re-renders
- **Conditional rendering**: Efficient conditional rendering to minimize DOM updates
- **Lazy loading**: Components and data loaded on demand

## Code Organization

### File Structure
- **Feature-based organization**: Components grouped by business domain
- **Separation of concerns**: UI components separate from business logic
- **Utility functions**: Common utilities centralized in `/lib` directory
- **Type definitions**: Interfaces and types co-located with components

### Naming Conventions
- **PascalCase**: Component names and interfaces
- **camelCase**: Variables, functions, and props
- **kebab-case**: File names and CSS classes
- **SCREAMING_SNAKE_CASE**: Constants and configuration values

### Documentation
- **JSDoc comments**: Complex functions documented with parameter descriptions
- **Inline comments**: Business logic explained with contextual comments
- **README patterns**: Comprehensive documentation for setup and deployment
- **Type annotations**: Self-documenting code through explicit typing

## Error Handling

### User Experience
- **Graceful degradation**: Fallback UI states for empty or error conditions
- **Loading states**: Proper loading indicators during async operations
- **Error boundaries**: Implicit error handling through component structure
- **User feedback**: Clear error messages and success confirmations

### Development Experience
- **Console logging**: Structured logging for debugging and monitoring
- **Error propagation**: Errors caught and handled at appropriate levels
- **Validation feedback**: Immediate validation feedback in forms
- **Development warnings**: Helpful warnings for missing required props

## Integration Patterns

### Third-party Libraries
- **Radix UI**: Consistent use of accessible, unstyled components
- **Lucide React**: Standardized icon usage throughout application
- **Date-fns**: Consistent date manipulation and formatting
- **Recharts**: Data visualization with consistent styling

### API Integration
- **Local-first approach**: Data stored locally with sync capabilities
- **Offline support**: Application functions without network connectivity
- **Cross-tab sync**: Real-time updates across browser tabs
- **Export capabilities**: Data export functionality for reporting