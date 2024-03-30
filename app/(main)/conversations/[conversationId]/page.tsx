import ConversationBody from '@/app/_components/Conversation/ConversationBody'
import ConversationForm from '@/app/_components/Conversation/ConversationForm'
import ConversationsHeader from '@/app/_components/Conversation/ConversationsHeader'
import { getConversationByIdWithMessages } from '@/shared/actions/getConversationByIdWithMessages'
import { FullConversationType } from '@/shared/types/Conversation'
import React from 'react'

interface ConversationIdPageProps {
    params: { conversationId: string }
}

const ConversationIdPage = async ({ params: { conversationId } }: ConversationIdPageProps) => {

    const conversationByIdWithMessages: FullConversationType | null = await getConversationByIdWithMessages(conversationId)
    if (!conversationByIdWithMessages) {
        return (
            <div className=" flex items-center justify-center">
                <span>
                    No Conversations Found
                </span>
            </div>
        )
    }

    return (
        <div className="h-full w-full flex flex-col justify-between">
            <ConversationsHeader conversation={conversationByIdWithMessages} />
            <ConversationBody conversation={conversationByIdWithMessages} />
            <ConversationForm conversation={conversationByIdWithMessages} />
        </div>
    )
}

export default ConversationIdPage