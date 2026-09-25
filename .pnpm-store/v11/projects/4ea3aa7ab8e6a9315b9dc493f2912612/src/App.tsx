import { AppProvider } from '@/AppProvider';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeScreen } from '@/screens/home/HomeScreen';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}
