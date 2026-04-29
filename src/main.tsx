import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";

const myTheme = createSystem(defaultConfig, {
  theme: {
    breakpoints: {
      base: "0em",
      sm: "30em", // 480px
      md: "48em", // 768px
      lg: "62em", // 992px
      xl: "90em", // 1440px
      "2xl": "96em", // 1536px
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider value={myTheme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
);
