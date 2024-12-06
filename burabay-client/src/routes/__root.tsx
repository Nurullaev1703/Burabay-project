
import {
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router";
import { RootRouteContext } from "../types/tanstack";
import { useAuth } from "../features/auth";
import { InitPage } from "../pages/init/InitPage";

export const AUTH_PATH = [
    "/auth/welcome","/auth/client","/auth/provider",
    "/register", "/register/success", "/what-next", 
    "/test", "/profile/edit/change-phone", "/contract",
    "/register/accept"
]

export const Route = createRootRouteWithContext<RootRouteContext>()({
    component: () => {
        const {token, isAuthenticated} = useAuth()
        
        // при отсутствии авторизации идет попытка получения профиля
        if(token && !isAuthenticated){
            return <InitPage />
        }
        return(
        <>
            <div className="overflow-y-auto container mx-auto relative max-w-[1280px] overflow-x-hidden">
                <Outlet />
            </div>
        </>
        )
    },
    // beforeLoad: (options) =>{
    //     const isAuthPath = AUTH_PATH.includes(options.location.pathname);
    //     const isAuthAcceptPath = options.location.pathname.startsWith('/auth/accept/');

    //     if(
    //         !isAuthPath &&
    //         !isAuthAcceptPath &&
    //         !tokenService.hasValue()
    //     ){
    //         throw redirect({to:"/auth"})
    //     }
    // }
});
