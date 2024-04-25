"use client"
import React, { useEffect, useMemo, useState } from 'react'
import AvatarComp from '../UI/AvatarComp'
import { FullConversationType } from '@/shared/types/Conversation'
import { useOtherUser } from '@/shared/hooks/useOtherUser'
import Link from 'next/link'
import { ChevronLeft, EllipsisVertical } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import UserConversationAction from '../User/UserConversationAction'
import AvatarGroup from '../UI/AvatarGroup'
import { pusherClient } from '@/shared/lib/pusher'
import { useParams } from 'next/navigation'
import { User } from '@prisma/client'
import { cn } from '@/shared/lib/utils'
import { useUserContext } from '@/shared/context/UserContext'
import toast from 'react-hot-toast'

interface ConversationHeaderProps {
    conversation: FullConversationType
}

const ConversationsHeader = ({
    conversation
}: ConversationHeaderProps) => {

    const { conversationId } = useParams()
    const otherUserDetails = useOtherUser(conversation)
    const [userTyping, setUserTyping] = useState<User>({} as User)
    const { currentUser } = useUserContext()

    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`
        }
        return "Active"
    }, [conversation])

    const handleConversationMemberTyping = ({ user, isTyping }: { user: User, isTyping: boolean }) => {
        if (isTyping) {
            setUserTyping({ ...user })
        } else {
            setUserTyping({} as User)
        }
    }

    const handleConversationLeft = ({ conversation, leftBy: { id, name } }: {
        conversation: FullConversationType,
        leftBy: {
            id: string,
            name: string,
        },
    }) => {
        if (id !== currentUser.id) {
            toast(`${name} left this conversation group!!`,
                {
                    icon: '👋🏻',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }
    }

    useEffect(() => {
        const convId = conversationId as string
        pusherClient.subscribe(convId)
        pusherClient.bind("member:typing", handleConversationMemberTyping)
        pusherClient.bind("conversation:left", handleConversationLeft)


        return () => {
            pusherClient.unsubscribe(convId)
            pusherClient.unbind("member:typing", handleConversationMemberTyping)
            pusherClient.unbind("conversation:left", handleConversationLeft)
        }
    }, [conversationId])

    const isUserTyping = userTyping && Object.keys(userTyping).length > 0
    const showTypingHeader = isUserTyping && currentUser.id !== userTyping.id

    return (

        <div className="w-full h-[10%]  flex flex-col">
            <div className="h-[70%] px-2 py-2 border-b-[1px] shadow-sm  border-gray-100 flex items-center justify-between">
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
            <div className={cn("h-[30%]  bg-gray-50", showTypingHeader && "")}>
                {
                    showTypingHeader && (
                        <div className="flex items-center space-x-2 h-full w-full bg-messangerBlue/10">
                            <div className="px-3 pt-2 flex justify-center items-center h-full   rounded-full">
                                <div className="dot mx-[3px] size-[6px] animate-pulse rounded-full bg-messangerBlue animate-wave-1"></div>
                                <div className="dot mx-[3px] size-[6px] animate-pulse rounded-full bg-messangerBlue animate-wave-2"></div>
                                <div className="dot mx-[3px] size-[6px] animate-pulse rounded-full bg-messangerBlue animate-wave-3"></div>
                            </div>
                            <div className='text-sm font-bold text-messangerBlue'>
                                {userTyping.name} is typing
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ConversationsHeader