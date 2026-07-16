import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import BikeDetails from './pages/BikeDetails';
import RenterDashboard from './pages/RenterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bike/:id" element={<BikeDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout/:bikeId" element={
              <ProtectedRoute><Checkout /></ProtectedRoute>
            } />
            <Route path="/invoice/:bookingId" element={
              <ProtectedRoute><Invoice /></ProtectedRoute>
            } />
            <Route path="/renter-dashboard" element={
              <ProtectedRoute allowedRoles={['Renter', 'Admin']}><RenterDashboard /></ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
