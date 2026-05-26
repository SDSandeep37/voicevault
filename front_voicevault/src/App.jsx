import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import ActionPage from "./Pages/ActionPage/ActionPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/action" element={<ActionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
