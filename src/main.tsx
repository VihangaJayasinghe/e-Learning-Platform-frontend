import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // Extension is omitted or .tsx is implied

// 1. Get the root element
const rootElement = document.getElementById("root");

// 2. Add a 'Non-null assertion' or a safety check
if (!rootElement) {
  throw new Error(
    "Failed to find the root element. Make sure index.html has <div id='root'></div>",
  );
}

// 3. Render the app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
