import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import GameCard from "./components/GameCard";
import SignUpPage from "./components/SignUpPage";
import LogInPage from "./components/LogInPage";
import MyGames from "./components/MyGames";
import GameSlider from "./components/GameSlider";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<GameCard />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/my-games" element={<MyGames />} />
      </Routes>
    </Router>
  );
}

export default App;
