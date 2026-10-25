import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import OrdenesProvider from "./context/OrdenesProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <OrdenesProvider>
        <App />
      </OrdenesProvider>
    </BrowserRouter>
  </StrictMode>
);
