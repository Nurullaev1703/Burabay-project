import { RouterProvider, createRouter } from "@tanstack/react-router";
import { FC } from "react";
import { routeTree } from "../routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import { AuthProvider, useAuth } from "../features/auth";
import { LanguageProvider } from "../shared/context/LanguageProvider";
import { theme } from "../shared/ui/inputs-theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useIOSFixes } from "../shared/hooks/useIOSFixes";
import "../shared/styles/ios-bounce-fix.css";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    isAuthenticated: false,
  },
});

export const queryClient = new QueryClient();

const InnerApp: FC = function InnerApp() {
  const { isAuthenticated } = useAuth();
  useIOSFixes();

  return <RouterProvider router={router} context={{ isAuthenticated }} />;
};
export const InitializeApp: FC = function InitializeApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <LanguageProvider>
              <InnerApp />
            </LanguageProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
