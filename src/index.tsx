import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import { useScorm } from "@/hooks/use-scorm";
import App from "@/components/app/app";

const rootElement = document.querySelector("#root");

if (rootElement === null) {
  throw new Error("No #root element found");
}

useScorm.getState().init();

const root = ReactDOM.createRoot(rootElement);

root.render(
  <Router>
    <App />
  </Router>,
);
