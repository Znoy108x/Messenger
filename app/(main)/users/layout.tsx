import React from 'react'
import SideBar from '../../_components/SideBar'
import { getUsers } from '@/shared/actions/getUsers'
import UserList from '../../_components/UserList'

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {

    const users = await getUsers()

    return (
        <SideBar>
            <div className="h-full flex">
                <UserList users={users} />
                {children}
            </div>
        </SideBar>
    )
}

export default UsersLayout