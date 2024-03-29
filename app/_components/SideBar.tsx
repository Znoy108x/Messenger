import React from 'react'
import DeskTopSidebar from './DeskTopSidebar'
import MobileFooter from './MobileFooter'
import { getCurrentUser } from '@/shared/actions/getCurrentUser'

const SideBar = async ({ children }: { children: React.ReactNode }) => {

    const currentUser = await getCurrentUser()

    return (
        <div className="h-full w-full">
            <DeskTopSidebar />
            <MobileFooter />
            <main className="lg:pl-20 h-full">
                {children}
            </main>
        </div>
    )
}

export default SideBar