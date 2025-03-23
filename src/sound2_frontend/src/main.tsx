import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./styles/locomotive-scroll.css";
import { InternetIdentityProvider } from "ic-use-internet-identity";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </StrictMode>
);
