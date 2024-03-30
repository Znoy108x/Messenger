import { User } from '@prisma/client'
import React from 'react'
import UserItem from './UserItem'

const UserList = ({ users }: { users: User[] }) => {

    return (
        <aside className="px-5 pb-20 lg:pb-0 lg:w-[430px] lg:block overflow-y-auto border-r border-gray-200 block w-full">
            <div className="px-1">
                <div className="flex justify-between mb-4 pt-4">
                    <div className="text-2xl font-bold text-neutral-800">
                        People
                    </div>
                </div>
                <div className="flex flex-col w-full ">
                    {
                        users.map((user: User) => (
                            <UserItem key={user.id} user={user} />
                        ))
                    }
                </div>
            </div>
        </aside>
    )
}

export default UserList