import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { RepoProvider } from "./context/RepoContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RepoProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RepoProvider>
  </React.StrictMode>
);