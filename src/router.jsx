import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashBoard from './pages/Dashboard';

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/dashboard', element: <DashBoard /> },
]);
