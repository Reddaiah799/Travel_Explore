import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import { AdminLogin } from './components/TravelExplore/admin-login.jsx';
import { AdminDashboard } from './components/TravelExplore/admin-dashboard.jsx';
import { UserLogin } from './components/TravelExplore/user-login.jsx';
import { UserRegister } from './components/TravelExplore/user-register.jsx';
import { UserDashboard } from './components/TravelExplore/user-dashboard.jsx';
import { PlaceDetails } from './components/TravelExplore/PlaceDetails.jsx';


createRoot(document.getElementById('root')).render(
  
    <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<AdminLogin/>}/>
       <Route path="/admin-dashboard" element={<AdminDashboard />} />
       <Route path="/user-login" element={<UserLogin/>}/>
       <Route path="/admin-login" element={<AdminLogin/>}/>
       <Route path="/user-register" element={<UserRegister/>} />
       <Route path="/user-dashboard" element={<UserDashboard/>}/>
       <Route path="/placeDetails/:id" element={<PlaceDetails />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>

);
