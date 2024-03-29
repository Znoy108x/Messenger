"use client"
import { Button } from '@/shared/components/ui/button'
import { useConversation } from '@/shared/hooks/useConversation'
import { cn } from '@/shared/lib/utils'
import { FullConversationType } from '@/shared/types/Conversation'
import { Users } from 'lucide-react'
import { useRouter } from 'next13-progressbar'
import React, { useState } from 'react'
import ConversationItem from './ConversationItem'

interface Props {
    conversations: FullConversationType[]
}

const ConversationList = ({ conversations }: Props) => {

    const [allConversations, setAllConversations] = useState(conversations)
    const { conversationId, isOpen } = useConversation()
    const router = useRouter()

    return (
        <aside className={cn("px-5 pb-20 lg:pb-0 lg:w-[430px] lg:block overflow-y-auto border-r border-gray-200 block w-full", isOpen ? "hidden" : "block")}>
            <div className="px-1">
                <div className="flex justify-between mb-4 pt-4">
                    <div className="text-2xl font-bold text-neutral-800">
                        Message
                    </div>
                    <Button variant={"ghost"}>
                        <Users />
                    </Button>
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