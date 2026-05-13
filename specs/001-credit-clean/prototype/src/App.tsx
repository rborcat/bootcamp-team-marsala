import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import HomePage from '@/pages/HomePage';
import DebtSummaryPage from '@/pages/DebtSummaryPage';
import OptionsPage from '@/pages/OptionsPage';
import ConfirmPage from '@/pages/ConfirmPage';
import TrackingPage from '@/pages/TrackingPage';

export default function App() {
  return (
    <AppProvider>
      <main className="mx-auto w-full max-w-[390px] min-h-dvh bg-white shadow-md">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/debt" element={<DebtSummaryPage />} />
          <Route path="/options" element={<OptionsPage />} />
          <Route path="/confirm" element={<ConfirmPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          {/* Catch-all: redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </AppProvider>
  );
}
