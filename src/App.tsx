import { AppProvider, useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import ClientLogin from '@/pages/ClientLogin';
import ClientDashboard from '@/pages/ClientDashboard';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';

function AppContent() {
  const { mode, clientLoggedIn, adminLoggedIn } = useApp();

  if (mode === 'client') {
    return clientLoggedIn ? (
      <>
        <Navbar />
        <ClientDashboard />
      </>
    ) : (
      <>
        <Navbar />
        <ClientLogin />
      </>
    );
  }

  return adminLoggedIn ? (
    <>
      <Navbar />
      <AdminDashboard />
    </>
  ) : (
    <>
      <Navbar />
      <AdminLogin />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
