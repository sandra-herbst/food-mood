import { Routes, Route } from "react-router-dom";
import "./App.scss";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Game from "./pages/game/Game";
import GameRules from "./pages/gameRules/GameRules";
import DishDetails from "./pages/dishDetails/DishDetails";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./routing/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rules"
        element={
          <ProtectedRoute>
            <GameRules />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dish/:id?"
        element={
          <ProtectedRoute>
            <DishDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
