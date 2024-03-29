"use client"
import { FullConversationType } from '@/shared/types/Conversation'
import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import { useConversation } from '@/shared/hooks/useConversation'
import axios from 'axios'

const ConversationBody = ({ conversation }: { conversation: FullConversationType }) => {

    const [messages, setMessages] = useState(conversation.messages)
    const bottomRef = useRef<HTMLDivElement>(null)
    const { conversationId } = useConversation()

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])

    return (
        <div className="w-full grow overflow-y-auto bg-gray-50 h-20">
            {
                messages.map((message, index) => (
                    <Message key={message.id} data={message} isLast={index === messages.length - 1} />
                ))
            }
            <div ref={bottomRef} className="pt-24" />
        </div>
    )
}

export default ConversationBody