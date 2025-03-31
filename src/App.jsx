import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import GameCard from "./components/GameCard";
import SignUpPage from "./components/SignUpPage";
import LogInPage from "./components/LogInPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<GameCard />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
      </Routes>
    </Router>
  );
}

export default App;
