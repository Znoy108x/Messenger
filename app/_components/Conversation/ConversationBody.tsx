"use client"
import { FullConversationType, FullMessageType } from '@/shared/types/Conversation'
import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import { useConversation } from '@/shared/hooks/useConversation'
import axios from 'axios'
import { pusherClient } from '@/shared/lib/pusher'
import find from "lodash"

const ConversationBody = ({ conversation }: { conversation: FullConversationType }) => {

    const [messages, setMessages] = useState(conversation.messages)
    const bottomRef = useRef<HTMLDivElement>(null)
    const { conversationId } = useConversation()

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])

    useEffect(() => {
        pusherClient.subscribe(conversationId)
        bottomRef?.current?.scrollIntoView()

        const newMessageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`)
            setMessages((current) => {
                const isAlreadyPresent = messages.find(mesEle => mesEle.id === message.id)
                if (isAlreadyPresent) {
                    return current
                }
                return [...current, message]
            })
            bottomRef?.current?.scrollIntoView()
        }

        const messageUpdateHandler = (newMessage: FullMessageType) => {
            setMessages((current) => current.map(currMess => {
                if (currMess.id === newMessage.id) {
                    return newMessage
                }
                return currMess
            }))
        }

        pusherClient.bind("messages:new", newMessageHandler)
        pusherClient.bind("message:update", messageUpdateHandler)

        return () => {
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind("messages:new")
            pusherClient.unbind("message:update")
        }
    }, [conversationId, messages])

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