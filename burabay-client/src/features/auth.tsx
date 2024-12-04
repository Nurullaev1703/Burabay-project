import { createContext, useContext, useEffect, useState } from "react";
import { apiService } from "../services/api/ApiService";
import { tokenService } from "../services/storage/Factory";
import { Profile } from "../pages/profile/model/profile";

// контекст, который управляет состояниями авторизации
export interface AuthContext{
    isAuthenticated: boolean;
    setToken:(token:string) => void
    user?: Profile
    token:string
    setUser: (value: Profile) => void
    resetToken: () => void
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({children}: {children:React.ReactNode}){
    const [token, setToken] = useState<string>("")
    const [user, setUser] = useState<Profile>()
    const isAuthenticated = !!token && !!user

    const handleSaveToken = (newToken:string) =>{
        apiService.saveBearerToken(newToken)
        tokenService.setValue({
            token: newToken
        })
        setToken(newToken)
    }
    const handleResetToken = () =>{
        apiService.deleteBearerToken()
        tokenService.deleteValue()
        setToken("")
    }

    useEffect(() => {
        if(!tokenService.hasValue()) return

        const localStorageToken = tokenService.getValue()
        handleSaveToken(localStorageToken.token)
    },[])

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setToken:handleSaveToken, 
            user, 
            token, 
            setUser,
            resetToken: handleResetToken
        }}>
            {children}
        </AuthContext.Provider>
    )
}
export function useAuth(){
    const context = useContext(AuthContext)

    if(!context){
        throw Error("Приложение не обернуто в AuthProvider")
    }
    return context
}