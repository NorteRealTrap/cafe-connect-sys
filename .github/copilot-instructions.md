# AI Coding Agent Instructions for Cafe Connect System

## Project Overview
This project is a web application built with the following technologies:
- **Vite**: For fast development and build tooling.
- **TypeScript**: For type-safe JavaScript development.
- **React**: For building user interfaces.
- **shadcn-ui**: A component library for consistent UI design.
- **Tailwind CSS**: For utility-first CSS styling.

The application is structured into feature-based directories under `src/`, with reusable UI components, hooks, and pages. The design emphasizes modularity and reusability.

## Key Directories and Files
- `src/components/`: Contains feature-specific components.
  - Example: `dashboard/DashboardHeader.tsx` for the dashboard header.
- `src/ui/`: Houses reusable UI components (e.g., `button.tsx`, `dialog.tsx`).
- `src/hooks/`: Custom React hooks (e.g., `use-mobile.tsx`).
- `src/pages/`: Page-level components for routing (e.g., `Dashboard.tsx`, `NotFound.tsx`).
- `vite.config.ts`: Configuration for Vite.
- `tailwind.config.ts`: Tailwind CSS configuration.

## Developer Workflows
### Local Development
1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### Build for Production
To create a production build:
```sh
npm run build
```

### Linting and Formatting
Ensure code quality with:
```sh
npm run lint
```

### Testing
(Currently, no explicit testing setup is mentioned. Add details here if testing is configured.)

## Project-Specific Conventions
- **Component Structure**: Components are organized by feature or reusability. Reusable components reside in `src/ui/`.
- **Styling**: Tailwind CSS is used for styling. Follow utility-first principles.
- **State Management**: State is managed locally within components or through React Context API. No external state management library is currently used.
- **TypeScript**: Use strict typing for all components and utilities.

## Integration Points
- **External Services**: The project integrates with [Lovable](https://lovable.dev) for deployment and domain management.
- **Custom Domains**: Domains can be configured via the Lovable dashboard.

## Examples of Common Patterns
### Creating a New Page
1. Add a new file in `src/pages/` (e.g., `NewPage.tsx`).
2. Define the component and export it.
3. Update the router configuration to include the new page.

### Adding a New UI Component
1. Create the component in `src/ui/`.
2. Use Tailwind CSS for styling.
3. Export the component and document its usage.

### Communication Between Components
- Use props to pass data between parent and child components.
- Utilize React Context for global state sharing when necessary.

## Notes for AI Agents
- Follow the existing directory structure and naming conventions.
- Use examples from `src/ui/` for creating new reusable components.
- Refer to `vite.config.ts` and `tailwind.config.ts` for build and styling configurations.
- Ensure all new code is type-safe and adheres to TypeScript best practices.
- When adding new features, ensure consistency with the modular design principles.

For further details, consult the `README.md` or the project maintainers.