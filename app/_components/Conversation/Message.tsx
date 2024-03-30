"use client"
import React from 'react'
import AvatarComp from '../UI/AvatarComp'
import { useSession } from 'next-auth/react'
import { FullMessageType } from '@/shared/types/Conversation'
import { cn } from '@/shared/lib/utils'
import { format } from 'date-fns'
import Image from 'next/image'
import { UserSeenList } from '../User/UsersSeenList'

const Message = ({ data, isLast }: { data: FullMessageType, isLast: boolean }) => {

    const session = useSession()
    const isOwn = session?.data?.user?.email === data?.sender?.email
    const otherUserSeenList = (data.seenBy || []).filter(user => user.email !== data.sender.email)
    console.log({
        isOwn,
        otherUserSeenList,
        user: session?.data?.user,
        data: data
    })

    return (
        <div className={cn("p-4 w-full flex items-center", isOwn ? "justify-end" : "justify-start")}>
            <div className={cn("flex space-x-3 w-auto gap-x-3", isOwn && "flex-row-reverse")}>
                <AvatarComp />
                <div className={cn("flex flex-col space-y-1", isOwn && "items-end")}>
                    <span className="text-xs font-medium text-neutral-600">
                        {format(new Date(data.createdAt), 'p')}
                    </span>

                    {data.body && (
                        <div className={cn('rounded-3xl px-7 py-2', isOwn ? "bg-messangerBlue text-white" : "bg-white")}>
                            {data.body}
                        </div>
                    )}
                    {
                        data.image && (
                            <div className={cn('rounded-3xl p-4 shadow-xl', isOwn ? "bg-messangerBlue text-white" : "bg-white")}>
                                <Image src={data.image} alt="Message Image" height={100} width={100} className='w-[300px] h-[300px] object-cover rounded-2xl' />
                            </div>
                        )
                    }
                    {
                        isOwn && <UserSeenList seenUsersList={otherUserSeenList} />
                    }
                </div>
            </div>
        </div >
    )
}

export default Message