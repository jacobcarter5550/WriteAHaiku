import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Portfolio from "./components/portfolio/portfolio.tsx";
import Sample from "./pages/sample.js";
import TaxMgmtDashboard from "./components/taxMgmt/taxMgmt.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import LoginPage from "./pages/loginTP.tsx";
import Register from "./pages/registerTP.tsx";
import ForgotPassword from "./pages/forgotTP.tsx";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { useTheme } from "next-themes";
import ProviderProvider from "./providers/ProviderProvider.tsx";
import { useSignals } from "@preact/signals-react/runtime";
import { Helmet } from "react-helmet";
import Nav from "./components/nav/Nav.tsx";
import ActiveEquity from "./pages/activeEquity.tsx";
import ResearchView from "./components/research/index.tsx";
import { useNavigate } from "react-router-dom";
import Advisor from "./pages/advisor.tsx";
import AlternativeResearch from './components/taxMgmt/alternativePortfolio/index.tsx'
import Performance from './components/performance/index.tsx'
import ProjectionManagementDashboard from "./components/taxMgmt/projectionManagement.tsx";

const App = () => {
  useSignals();
  return (
    <ProviderProvider>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <title>Linvest21</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div className="app-container">
        <AppContent />
      </div>
    </ProviderProvider>
  );
};

const AppContent = () => {
  const location = useLocation();

  const { theme } = useTheme();

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);
  console.log("envtest1:", process.env.REACT_APP_HOST_IP_ADDRESS);

  const isLoginPage =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot";
  const shouldRenderHeaderFooter = !isLoginPage;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {shouldRenderHeaderFooter && <Nav />}
        <ToastContainer />
        <Routes>
          <Route path="/active-equity" element={<ActiveEquity />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Portfolio />} />
          <Route path="/tax" element={<TaxMgmtDashboard />} />
          <Route path="/research" element={<ResearchView />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/sample" element={<Sample />} />
          <Route path="/alternativeInvestment" element={<AlternativeResearch />} />
          <Route path="/advisor" element={<Advisor />} />
          <Route
            path="/tax-projection"
            element={<ProjectionManagementDashboard />}
          />
        </Routes>
      </DndProvider>
    </>
  );
};

export default App;
