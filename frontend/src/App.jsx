import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import LandingPage from "./pages/LandingPage";
import OrganizerLogin from "./pages/OrganizerLogin";
import OrganizerSignup from "./pages/OrganizerSignup";
import PlayerLogin from "./pages/PlayerLogin";
import PlayerSignup from "./pages/PlayerSignup";
import OTPVerification from "./pages/OTPVerification";
import CompleteProfile from "./pages/CompleteProfile";
import PrivateRoute from "./components/PrivateRoute";
import OrganizerHome from "./pages/OrganizerHome";
import Tournaments from "./pages/Tournaments";
import CreateTournament from "./pages/CreateTournament";
import TournamentDetail from "./pages/TournamentDetail";
import PlayerHome from "./pages/PlayerHome";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Organizer Routes */}
          <Route path="/organizer/login" element={<OrganizerLogin />} />
          <Route path="/organizer/signup" element={<OrganizerSignup />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route
            path="/organizer/verify-otp"
            element={
              <PrivateRoute>
                <OTPVerification />
              </PrivateRoute>
            }
          />
          <Route
            path="/organizer/home"
            element={
              <PrivateRoute>
                <OrganizerHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/organizer/tournaments"
            element={
              <PrivateRoute>
                <Tournaments />
              </PrivateRoute>
            }
          />
          <Route
            path="/organizer/tournaments/create"
            element={
              <PrivateRoute>
                <CreateTournament />
              </PrivateRoute>
            }
          />
          <Route
            path="/organizer/tournaments/:id"
            element={
              <PrivateRoute>
                <TournamentDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/organizer/tournaments/edit/:id"
            element={
              <PrivateRoute>
                <CreateTournament />
              </PrivateRoute>
            }
          />
          
          {/* Player Routes */}
          <Route path="/player/login" element={<PlayerLogin />} />
          <Route path="/player/signup" element={<PlayerSignup />} />
          <Route
            path="/player/verify-otp"
            element={
              <PrivateRoute>
                <OTPVerification />
              </PrivateRoute>
            }
          />
          <Route
            path="/player/profile"
            element={
              <PrivateRoute>
                <PlayerHome />
              </PrivateRoute>
            }
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;