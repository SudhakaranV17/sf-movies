import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import { Toaster } from "react-hot-toast";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";
import App from "./App.tsx";
import QueryProvider from "./shared/providers/QueryProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <PrimeReactProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--color-bg-raised)",
              color: "var(--color-text-primary)",
              border: "0.5px solid var(--color-border-strong)",
              fontSize: "13px",
            },
            success: { iconTheme: { primary: "var(--color-accent)", secondary: "var(--color-bg-page)" } },
            error: { iconTheme: { primary: "var(--color-danger)", secondary: "var(--color-bg-page)" } },
          }}
        />
      </PrimeReactProvider>
    </QueryProvider>
  </StrictMode>,
);
