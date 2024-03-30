import React from 'react'
import DeskTopSidebar from './DeskTopSidebar'
import MobileFooter from './MobileFooter'
import { getCurrentUser } from '@/shared/actions/getCurrentUser'
import { redirect } from 'next/navigation'

const SideBar = async ({ children }: { children: React.ReactNode }) => {

    const currentUser = await getCurrentUser()

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