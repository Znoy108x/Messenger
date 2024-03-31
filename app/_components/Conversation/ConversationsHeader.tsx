"use client"
import React, { useMemo } from 'react'
import AvatarComp from '../UI/AvatarComp'
import { FullConversationType } from '@/shared/types/Conversation'
import { useOtherUser } from '@/shared/hooks/useOtherUser'
import Link from 'next/link'
import { ChevronLeft, EllipsisVertical } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import UserConversationAction from '../User/UserConversationAction'
import AvatarGroup from '../UI/AvatarGroup'

interface ConversationHeaderProps {
    conversation: FullConversationType
}

const ConversationsHeader = ({
    conversation
}: ConversationHeaderProps) => {

    const otherUserDetails = useOtherUser(conversation)
    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`
        }
        return "Active"
    }, [conversation])

    return (
        <div className="h-[6%] px-2 py-2 border-b-[1px] shadow-sm border-gray-100 flex items-center justify-between">
            <div className="flex gap-x-8 items-center">
                <div className="flex items-center">
                    <Button variant={"ghost"}>
                        <Link href="/conversations">
                            <ChevronLeft className='text-messangerBlue size-7' />
                        </Link>
                    </Button>
                    {
                        conversation.isGroup ? (
                            <AvatarGroup data={conversation} />
                        ) : (
                            <AvatarComp user={otherUserDetails} />
                        )
                    }
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-xl text-neutral-900 capitalize">{conversation.name || otherUserDetails.name}</span>
                    <span className="text-neutral-500 text-sm font-normal">{statusText}</span>
                </div>
            </div>
            <UserConversationAction conversation={conversation} />
        </div>
    )
}

export default ConversationsHeader