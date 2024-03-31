"use client"
import React from 'react'
import DeskTopSidebar from './DeskTopSidebar'
import MobileFooter from './MobileFooter'
import { redirect } from 'next/navigation'
import { useUserContext } from '@/shared/context/UserContext'

const SideBar = ({ children }: { children: React.ReactNode }) => {

    const { currentUser } = useUserContext()

    if (!currentUser) {
        redirect("/")
    }

    return (
        <div className="h-full w-full">
            <DeskTopSidebar currentUser={currentUser} />
            <MobileFooter />
            <main className="lg:pl-20 h-full ">
                {children}
            </main>
        </div>
    )
}

export default SideBar