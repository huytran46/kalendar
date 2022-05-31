import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import KalendarPage from "./pages/Kalendar";
import SchedulingPage from "./pages/Scheduling";
import Layout from "./Layout";
import "./App.scss";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<KalendarPage />} />
          <Route path="scheduling" element={<SchedulingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
