import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import DirectorDashboard from './pages/director/DirectorDashboard';
import AccountsDashboard from './pages/accounts/AccountsDashboard';
import Dashboard from './pages/employee/Dashboard';
import CreateVoucher from './pages/employee/CreateVoucher';
import MyVouchers from './pages/employee/MyVouchers';
import VoucherDetails from './pages/employee/VoucherDetails';
import EditVoucher from './pages/employee/EditVoucher';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRole="Employee">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/create"
          element={
            <ProtectedRoute allowedRole="Employee">
              <CreateVoucher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/vouchers"
          element={
            <ProtectedRoute allowedRole="Employee">
              <MyVouchers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/vouchers/:id"
          element={
            <ProtectedRoute allowedRole="Employee">
              <VoucherDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/vouchers/edit/:id"
          element={
            <ProtectedRoute allowedRole="Employee">
              <EditVoucher />
            </ProtectedRoute>
          }
        />

        <Route
          path="/director"
          element={
            <ProtectedRoute allowedRole="Director">
              <DirectorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/accounts"
          element={
            <ProtectedRoute allowedRole="Accounts">
              <AccountsDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
