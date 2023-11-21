import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import App from "./App";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5e604e",
      light: "#edeed9",
    },
    secondary: {
      main: "#4f4e60",
      light: "#edebff",
    },
    analogousA: {
      main: "#60584e",
      light: "#f1e7db",
    },
    analogousB: {
      main: "#56604e",
      light: "#e3efda",
    },
    emphasis: "#ebab44",
    selected: "#4484eb",
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
