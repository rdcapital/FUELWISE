# Tailwind rebuild guide for FuelWise

This project is now refactored to use Tailwind CSS instead of the older custom CSS helper classes. The goal of this guide is to help you rebuild the app from scratch while understanding what each file does and why each Tailwind class is used.

## 1. Create the React + Vite app

Start with a Vite React project:

```bash
npm create vite@latest smartfuellogapp -- --template react
cd smartfuellogapp
npm install
```

Install the dependencies used by this app:

```bash
npm install react-router-dom lucide-react recharts date-fns tailwindcss @tailwindcss/vite
```

## 2. Enable Tailwind in Vite

In [package.json](package.json), Tailwind and the Vite plugin are already included.

In [vite.config.js](vite.config.js), add:

```js
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

This lets Tailwind v4 work smoothly with Vite without a separate PostCSS setup.

## 3. Create the Tailwind entry stylesheet

The main styling file is [src/index.css](src/index.css).

It contains:

- `@import url(...)` for the Inter font
- `@import 'tailwindcss'` to load Tailwind
- `@theme` for reusable design tokens
- `@custom-variant dark` so the app can use Tailwind's dark mode

Example:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import 'tailwindcss';

@theme {
  --color-brand-500: #6366f1;
  --color-accent-500: #06b6d4;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

This replaces the old vanilla CSS file approach and keeps styling consistent across the app.

## 4. Bootstrap the app shell

### [src/main.jsx](src/main.jsx)

This file is the first thing React loads.

It does three important jobs:

1. Creates the React root
2. Wraps the app in router and context providers
3. Loads [src/index.css](src/index.css)

```jsx
import './index.css';
```

That single import is what turns your app into a Tailwind-styled app.

## 5. Create the routing structure

### [src/App.jsx](src/App.jsx)

This file defines the routes:

- `/` → Dashboard
- `/add` → Add fuel log
- `/history` → Fuel history
- `/analytics` → Analytics
- `/maintenance` → Maintenance
- `/reports` → Reports

The layout wrapper ensures every page shares the same shell.

## 6. Build the shared layout

### [src/components/layout/Layout.jsx](src/components/layout/Layout.jsx)

This file creates the global layout:

- sidebar on desktop
- drawer on mobile
- header at the top
- page content area for routes

The Tailwind classes used here control spacing, background color, and responsiveness.

Example:

```jsx
<div className="min-h-screen bg-slate-50 dark:bg-surface-900 transition-colors duration-300">
```

This is a good example of how Tailwind replaces custom layout CSS.

### [src/components/layout/Header.jsx](src/components/layout/Header.jsx)

This component controls the top bar and dark mode toggle.

Tailwind classes are used for:

- sticky positioning
- border and background styling
- spacing and alignment
- hover states

### [src/components/layout/Sidebar.jsx](src/components/layout/Sidebar.jsx)

This holds navigation and vehicle settings.

Tailwind handles:

- desktop and mobile layout transitions
- active navigation styling
- card-like panels
- modal form fields

Notice how the active link uses Tailwind utility classes instead of a `.nav-link.active` CSS rule.

## 7. Add global state with context

### [src/context/AppContext.jsx](src/context/AppContext.jsx)

This file stores:

- vehicle info
- dark mode preference

It also toggles the `dark` class on the root element so Tailwind can switch themes.

```jsx
if (state.darkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
```

That is the key to making Tailwind dark mode work.

## 8. Replace reusable UI styling with Tailwind components

### [src/components/ui/Button.jsx](src/components/ui/Button.jsx)

This is where the reusable button styles live.

Instead of using a `.btn` class from CSS, the component uses Tailwind utility classes like:

```jsx
className={`inline-flex items-center justify-center gap-2 rounded-xl ...`}
```

The button has variants for:

- primary
- secondary
- danger
- ghost

### [src/components/ui/Card.jsx](src/components/ui/Card.jsx)

The card wrapper now uses Tailwind border, background, shadow, and radius utilities.

### [src/components/ui/Modal.jsx](src/components/ui/Modal.jsx)

This uses Tailwind for:

- overlay backdrop
- centered positioning
- rounded corners
- border and shadow

### [src/components/ui/EmptyState.jsx](src/components/ui/EmptyState.jsx)

This is used when there are no records. Tailwind handles spacing and alignment cleanly.

## 9. Build the page screens

### Dashboard page

See [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx).

This page shows:

- a hero banner
- summary stat cards
- a recent logs list

The Tailwind classes create a modern dashboard without any custom CSS.

### Add Fuel Log page

See [src/pages/AddFuelLog.jsx](src/pages/AddFuelLog.jsx).

This page uses a form with Tailwind utilities for:

- input fields
- validation feedback
- layout spacing
- buttons and cards

Your form fields can be styled like this:

```jsx
<input
  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
/>
```

### Fuel History page

See [src/pages/FuelHistory.jsx](src/pages/FuelHistory.jsx).

This page includes:

- search box
- filter selects
- list rows
- edit and delete modals

Tailwind is used for layout, spacing, and form controls.

### Maintenance page

See [src/pages/Maintenance.jsx](src/pages/Maintenance.jsx).

This page uses Tailwind for:

- tabs
- reminder cards
- progress bars
- modal forms

### Analytics page

See [src/pages/Analytics.jsx](src/pages/Analytics.jsx).

This page uses Tailwind for the shell and cards, while Recharts handles the actual graph rendering.

### Reports page

See [src/pages/Reports.jsx](src/pages/Reports.jsx).

This page displays grouped statistics and tables using Tailwind classes for structure and styling.

## 10. How the Tailwind version differs from the old vanilla CSS version

The old version used classes such as:

- `btn`
- `input`
- `card`
- `nav-link`
- `fade-in`
- `slide-in`

Those are now replaced with direct Tailwind utilities such as:

- `rounded-xl`
- `border border-slate-200`
- `bg-white`
- `shadow-sm`
- `px-3.5 py-2.5`
- `animate-[fadeIn_0.3s_ease-out]`

That makes the UI easier to maintain and easier to understand.

## 11. Rebuild checklist

If you want to replicate this project yourself, follow this order:

1. Create the Vite React app
2. Install Tailwind and required libraries
3. Configure Vite with the Tailwind plugin
4. Create the Tailwind entry file
5. Add router and app providers
6. Build the layout and shared UI components
7. Add the pages one by one
8. Connect local storage and context state
9. Test with `npm run build`

## 12. Verify the app

The refactored app was verified with:

```bash
npm run build
```

It completed successfully, which confirms the Tailwind-based version is working.
