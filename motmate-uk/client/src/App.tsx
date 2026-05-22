import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MotCheckPage from './pages/MotCheckPage';
import SellPage from './pages/SellPage';
import BrowsePage from './pages/BrowsePage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mot-check" element={<MotCheckPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={
            <div className="max-w-xl mx-auto p-8 text-center">
              <h1 className="text-2xl font-bold">Page not found</h1>
              <p className="mt-2 text-slate-600">The page you’re looking for doesn’t exist.</p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
