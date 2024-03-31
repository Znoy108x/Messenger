"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import ConversationBody from "./ConversationBody"
import ConversationForm from "./ConversationForm"
import { FullConversationType, FullMessageType } from "@/shared/types/Conversation"
import { pusherClient } from "@/shared/lib/pusher"
import axios from "axios"

export const ConversationBodyAndInputForm = ({ conversationByIdWithMessages }: { conversationByIdWithMessages: FullConversationType }) => {

    const bottomRef = useRef<HTMLDivElement>(null)
    const { id: conversationId } = conversationByIdWithMessages
    const [messages, setMessages] = useState(conversationByIdWithMessages.messages)

    const setMessageInState = (newMessage: FullMessageType) => {
        setMessages((current) => current.map(currMess => {
            if (currMess.id === newMessage.id) {
                return newMessage
            }
            return currMess
        }))
        scrollToBottom()
    }

    const scrollToBottom = useCallback(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }, []);

    useEffect(() => {
        pusherClient.subscribe(conversationId)

        const newMessageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`)
            setMessages((current) => {
                const isAlreadyPresent = messages.find(mesEle => mesEle.id === message.id)
                if (isAlreadyPresent) {
                    return current
                }
                return [...current, message]
            })
            scrollToBottom()
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
    }, [conversationId, messages, scrollToBottom])


    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])

    return (
        <>
            <ConversationBody messages={messages} ref={bottomRef} />
            <ConversationForm conversation={conversationByIdWithMessages} setMessageInState={setMessageInState} />
        </>
    )
}