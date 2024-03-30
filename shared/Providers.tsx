"use client"
import Next13ProgressBar from 'next13-progressbar'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import { UserContextProvider } from './context/UserContext'

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <UserContextProvider>
            <SessionProvider>
                {children}
            </SessionProvider>
            <Toaster />
            <Next13ProgressBar height="4px" color="#009AFE" options={{ showSpinner: true }} showOnShallow />
        </UserContextProvider>
    )
}

export default Providers