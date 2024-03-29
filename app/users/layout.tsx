import React from 'react'
import SideBar from '../_components/SideBar'

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <SideBar>
            <div className="h-full w-full ">
                {children}
            </div>
        </SideBar>
    )
}

export default UsersLayout