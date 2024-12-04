import { router } from "../ini/InitializeApp"

declare module "@tanstack/react-router" {
    interface Register{
        router:typeof router
    }
}
declare module "@tanstack/react-router" {
    interface StaticDataRouteOption{
        title?:string
    }
}

export interface RootRouteContext{
    isAuthenticated:boolean
}