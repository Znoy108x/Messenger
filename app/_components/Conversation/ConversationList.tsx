"use client"
import { useConversation } from '@/shared/hooks/useConversation'
import { cn } from '@/shared/lib/utils'
import { FullConversationType } from '@/shared/types/Conversation'
import React, { useEffect, useMemo, useState } from 'react'
import ConversationItem from './ConversationItem'
import { User } from '@prisma/client'
import { CreateGroupDialog } from '../Dialogs/CreateGroupDialog'
import { useSession } from 'next-auth/react'
import { pusherClient } from '@/shared/lib/pusher'
import { useRouter } from 'next13-progressbar'

interface Props {
    conversations: FullConversationType[],
    users: User[]
}

const ConversationList = ({ conversations, users }: Props) => {

    const session = useSession()
    const router = useRouter()
    const { conversationId, isOpen } = useConversation()
    const [allConversations, setAllConversations] = useState(conversations)

    const pusherKey = useMemo(() => {
        return session?.data?.user?.email
    }, [session?.data?.user?.email])

    useEffect(() => {

        if (!pusherKey) {
            return;
        }

        const newConversationHandler = (newConversation: FullConversationType) => {
            setAllConversations(current => {
                const isNewConvAlreadyPresent = current.find(ele => ele.id === newConversation.id)
                if (isNewConvAlreadyPresent) {
                    return current
                }
                return [...current, newConversation]
            })
        }

        const conversationUpdateHandler = (updateConversation: FullConversationType) => {
            setAllConversations(current => current.map(currConv => {
                if (currConv.id === updateConversation.id) {
                    return {
                        ...currConv,
                        messages: updateConversation.messages
                    }
                } else {
                    return currConv
                }
            }))
        }

        const conversationDeleteHandler = (deleteConversation: FullConversationType) => {
            setAllConversations(current => { return [...current.filter(conv => conv.id !== deleteConversation.id)] })
            if(conversationId === deleteConversation.id){
                router.push("/conversations")
            }
        }

        pusherClient.subscribe(pusherKey)
        pusherClient.bind("conversation:new", newConversationHandler)
        pusherClient.bind("conversation:update", conversationUpdateHandler)
        pusherClient.bind("conversation:remove", conversationDeleteHandler)

        return () => {
            pusherClient.unsubscribe(pusherKey)
            pusherClient.unbind("conversation:new", newConversationHandler)
            pusherClient.unbind("conversation:update", conversationUpdateHandler)
            pusherClient.unbind("conversation:remove", conversationDeleteHandler)
        }
    }, [pusherKey])

    return (
        <aside className={cn("px-5 pb-20 lg:pb-0 lg:w-[430px] lg:block overflow-y-auto border-r border-gray-200 block w-full", isOpen ? "hidden" : "block")}>
            <div className="px-1">
                <div className="flex justify-between mb-4 pt-4">
                    <div className="text-2xl font-bold text-neutral-800">
                        Message
                    </div>
                    <CreateGroupDialog users={users} />
                </div>
                <div className="flex flex-col w-full ">
                    {
                        allConversations.map((conversation: FullConversationType) => (
                            <ConversationItem key={conversation.id} data={conversation} selected={conversationId === conversation.id} />
                        ))
                    }
                </div>
            </div>
        </aside>
    )
}

export default ConversationList