import { RouterProvider, createRouter } from '@tanstack/react-router';
import  { FC } from 'react';
import { routeTree } from '../routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { AuthProvider, useAuth } from '../features/auth';
import { LanguageProvider } from '../shared/context/LanguageProvider';
import { theme } from '../shared/ui/inputs-theme';
import { ModalProvider } from '../shared/context/ModalProvider';


export const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
        isAuthenticated: false
    }
})

export const queryClient = new QueryClient()

const InnerApp:FC = function InnerApp(){
    const {isAuthenticated} = useAuth()
    return <RouterProvider router={router} context={{isAuthenticated}}/>
}
export const InitializeApp: FC = function InitializeApp() {

    return (
        <QueryClientProvider client={queryClient}>
            <LanguageProvider>
                <ThemeProvider theme={theme}>
                    <ModalProvider>
                        <AuthProvider>
                            <InnerApp/>
                        </AuthProvider>
                    </ModalProvider>
                </ThemeProvider>
            </LanguageProvider>
        </QueryClientProvider>
    )
};