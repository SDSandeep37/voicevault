import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { HashRouter, Routes, Route } from "react-router-dom";
import { UserAuthProvider } from "./Contexts/AuthContext";
import LandingPage from "./Pages/LandingPage/LandingPage";
import ActionPage from "./Pages/ActionPage/ActionPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import LoginPage from "./Pages/LoginPage/LoginPage";

const App = () => {
  return (
    // <Router>
    //   <UserAuthProvider>
    //     <Routes>
    //       <Route path="/" element={<LandingPage />} />
    //       <Route path="/action" element={<ActionPage />} />
    //       <Route path="/register" element={<RegisterPage />} />
    //       <Route path="/login" element={<LoginPage />} />
    //     </Routes>
    //   </UserAuthProvider>
    // </Router>
    <Router>
      <UserAuthProvider>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="action" element={<ActionPage />} />
        </Routes>
      </UserAuthProvider>
    </Router>
  );
};

export default App;
