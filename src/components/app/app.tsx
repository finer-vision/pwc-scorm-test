import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppReset, AppVersion } from "@/components/app/app.styles";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import End from "@/pages/end";
import pkg from "../../../package.json";

export default function App() {
  return (
    <>
      <AppReset />
      <AppVersion>v{pkg.version}</AppVersion>
      <React.Suspense fallback="Loading...">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/end" element={<End />} />
        </Routes>
      </React.Suspense>
    </>
  );
}
