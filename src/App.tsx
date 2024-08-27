import { AuthWalletContextProvider } from "@/contexts/AuthWalletContext";
import router from "@/router";
import { theme } from "@/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { AppContextProvider } from "./contexts/AppContext";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AppContextProvider>
          <AuthWalletContextProvider>
            <RouterProvider router={router} />
          </AuthWalletContextProvider>
        </AppContextProvider>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
