import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/react";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      signInUrl="/auth"
      signUpUrl="/auth"
      afterSignOutUrl="/auth"
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
);
