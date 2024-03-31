"use client"
import { FullMessageType } from '@/shared/types/Conversation'
import React, { RefObject, useEffect } from 'react'
import Message from './Message'
import { useConversation } from '@/shared/hooks/useConversation'
import axios from 'axios'

const ConversationBody = ({ messages, ref }: { messages: FullMessageType[], ref: RefObject<HTMLDivElement> }) => {

    const { conversationId } = useConversation()

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])

    return (
        <div ref={ref} className="w-full h-[86%] overflow-y-auto bg-gray-50 pb-40">
            {
                messages.map((message, index) => (
                    <Message key={message.id} data={message} isLast={index === messages.length - 1} />
                ))
            }
        </div>
    )
}

export default ConversationBody