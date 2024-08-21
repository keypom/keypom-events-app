import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import router from "@/router";
import { theme } from "@/theme";
import { RouterProvider } from "react-router-dom";
import { AuthWalletContextProvider } from "@/contexts/AuthWalletContext";
import { AppContextProvider } from "@/contexts/AppContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <AppContextProvider>
        <AuthWalletContextProvider>
          <RouterProvider router={router} />
        </AuthWalletContextProvider>
      </AppContextProvider>
    </ChakraProvider>
  </StrictMode>,
);
