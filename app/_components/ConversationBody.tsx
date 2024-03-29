"use client"
import { FullConversationType } from '@/shared/types/Conversation'
import React from 'react'

const ConversationBody = ({ conversation }: { conversation: FullConversationType }) => {

    return (
        <div className="w-full grow overflow-y-auto bg-gray-200 h-20">
        </div>
    )
}

export default ConversationBody