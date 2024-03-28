import React from 'react'
import SideBar from '../_components/SideBar'

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SideBar>
            <div className="h-full w-full ">
                {children}
            </div>
        </SideBar>
    )
}

export default UsersLayout