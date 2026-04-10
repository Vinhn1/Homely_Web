import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { Loader } from "lucide-react";
import ProtectedRoute from './components/ProtectedRoute';
import RedirectAuthenticatedUser from './components/RedirectAuthenticatedUser';
import ProfilePage from "./pages/dashboard/shared/ProfilePage";
import DashboardLayout from './layouts/DashboardLayout';
import SearchPage from './pages/SearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AreasPage from './pages/AreasPage';
import BlogPage from './pages/BlogPage';
import FavoritesPage from './pages/FavoritesPage';
import { useSocket } from './hooks/useSocket';
import { useNotificationStore } from './store/notificationStore';
import ErrorBoundary from './components/ErrorBoundary';

// Owner Pages
import MyListingsPage from './pages/dashboard/owner/MyListingsPage';
import PostPropertyPage from './pages/dashboard/owner/PostPropertyPage';
import BookingRequestsPage from './pages/dashboard/owner/BookingRequestsPage';
import OwnerRoute from './components/OwnerRoute';

// Shared Dashboard Pages
import NotificationsPage from './pages/dashboard/shared/NotificationsPage';
import MessagesPage from './pages/dashboard/shared/MessagesPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './components/AdminRoute';
import AdminOverviewPage from './pages/dashboard/admin/AdminOverviewPage';
import AdminUsersPage from './pages/dashboard/admin/AdminUsersPage';
import AdminListingsPage from './pages/dashboard/admin/AdminListingsPage';
import AdminReportsPage from './pages/dashboard/admin/AdminReportsPage';

// Socket initializer component (chạy sau khi auth check xong)
const SocketInitializer = () => {
  useSocket();
  return null;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch notifications khi đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-xl font-medium text-slate-600 animate-pulse">
          Đang kết nối với Homely...
        </p>
      </div>
    );
  }

  return (
    <>
      <Toaster position='top-right' richColors />
      {/* Socket kết nối real-time khi đã đăng nhập */}
      {isAuthenticated && <SocketInitializer />}

      <ErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/favorites" element={
            <ProtectedRoute><FavoritesPage /></ProtectedRoute>
          } />
          <Route path="/property/:id" element={
            <ProtectedRoute><PropertyDetailPage /></ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
          } />

          {/* Auth Routes */}
          <Route path="/signin" element={
            <RedirectAuthenticatedUser><SignInPage /></RedirectAuthenticatedUser>
          } />
          <Route path="/signup" element={
            <RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>
          } />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            {/* Shared */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="messages" element={<MessagesPage />} />

            {/* Owner Only */}
            <Route path="my-listings" element={<OwnerRoute><MyListingsPage /></OwnerRoute>} />
            <Route path="post-property" element={<OwnerRoute><PostPropertyPage /></OwnerRoute>} />
            <Route path="edit-property/:id" element={<OwnerRoute><PostPropertyPage /></OwnerRoute>} />
            <Route path="booking-requests" element={<OwnerRoute><BookingRequestsPage /></OwnerRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="listings" element={<AdminListingsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
