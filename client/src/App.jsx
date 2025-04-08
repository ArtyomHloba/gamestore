import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import GameCard from "./components/GameCard";
import SignUpPage from "./components/SignUpPage";
import LogInPage from "./components/LogInPage";
import MyGames from "./components/MyGames";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer />
      <main>
        <Routes>
          <Route path="/" element={<GameCard />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/my-games" element={<MyGames />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
