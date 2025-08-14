import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SleepScreen from "./screens/SleepScreen";
import ScanningScreen from "./screens/ScanningScreen";
import StatisticsScreen from "./screens/StatisticsScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen";
import ResultScreen from "./screens/ResultScreen";
import RecommendationsScreen from "./screens/RecommendationsScreen";
import BottomTabBar from "./components/BottomTabBar";

const AppLayout = () => (
  <>
    <Routes>
      <Route path="/" element={<SleepScreen />} />
      <Route path="/scan" element={<ScanningScreen />} />
      <Route path="/statistics" element={<StatisticsScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <BottomTabBar />
  </>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/recommendations" element={<RecommendationsScreen />} />

        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}
