import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { CssBaseline, Container } from "@mui/material";
import App from "./App";
import { store } from "./store";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CssBaseline />
        <Container sx={{ py: 3 }}>
          <App />
        </Container>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
