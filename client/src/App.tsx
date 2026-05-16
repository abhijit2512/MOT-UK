import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MotCheckPage from './pages/MotCheckPage';
import SellVehiclePage from './pages/SellVehiclePage';
import BrowseVehiclesPage from './pages/BrowseVehiclesPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mot" element={<MotCheckPage />} />
          <Route path="/sell" element={<SellVehiclePage />} />
          <Route path="/browse" element={<BrowseVehiclesPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="card p-8 text-center">
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-slate-600">The page you’re looking for doesn’t exist.</p>
    </div>
  );
}
