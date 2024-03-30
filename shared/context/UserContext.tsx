"use client"
import { User } from "@prisma/client"
import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser } from "../actions/getCurrentUser"
import { Loader } from "lucide-react"

type UserContextType = {

}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [currentUser, setCurrentUser] = useState<User>()
    const [loading, setLoading] = useState(true)

    const init = async () => {
        const currentUser = (await getCurrentUser()) as User
        setCurrentUser({ ...currentUser })
        setLoading(false)
    }

    useEffect(() => {
        init()
    }, [])

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader className="animate-spin text-messangerBlue" />
            </div>
        )
    }

    return (
        <UserContext.Provider value={{

        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("useUserContext must be used inside UserContextProvider")
    }
    return context
}