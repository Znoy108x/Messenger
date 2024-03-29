import ConversationList from '@/app/_components/ConversationList'
import SideBar from '@/app/_components/SideBar'
import { getConversations } from '@/shared/actions/getConversations'
import { FullConversationType } from '@/shared/types/Conversation'
import React from 'react'

const ConversationLayout = async ({ children }: { children: React.ReactNode }) => {

    const conversations : FullConversationType[] = await getConversations()

    return (
        <SideBar>
            <div className="h-full flex">
                <ConversationList conversations={conversations} />
                {children}
            </div>
        </SideBar>
    )
}

export default ConversationLayout