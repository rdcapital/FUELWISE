/**
 * App.jsx
 * Root route configuration using React Router v7.
 *
 * All pages are wrapped in <Layout> which provides the sidebar and header.
 * React Router's <Outlet> inside Layout renders the matched page component.
 */
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AddFuelLog from './pages/AddFuelLog';
import FuelHistory from './pages/FuelHistory';
import Analytics from './pages/Analytics';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';

export default function App() {
  return (
    <Routes>
      {/*
       * The "/" route uses Layout as the parent element.
       * All child routes render inside Layout's <Outlet>.
       */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="add" element={<AddFuelLog />} />
        <Route path="history" element={<FuelHistory />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="reports" element={<Reports />} />
        {/* Catch-all: redirect unknown routes to dashboard */}
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
