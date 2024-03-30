import { Button } from '@/shared/components/ui/button'
import { FullConversationType, FullMessageType } from '@/shared/types/Conversation'
import React, { useCallback, useMemo } from 'react'
import AvatarComp from './AvatarComp'
import { useRouter } from 'next13-progressbar'
import { format } from "date-fns"
import { useOtherUser } from '@/shared/hooks/useOtherUser'
import { useSession } from 'next-auth/react'
import Email from 'next-auth/providers/email'
import { cn } from '@/shared/lib/utils'

interface Props {
    data: FullConversationType,
    selected?: boolean
}

const ConversationItem = ({ data, selected }: Props) => {

    console.log(data)

    const router = useRouter()
    const session = useSession()
    const otherUserData = useOtherUser(data)

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [router, data])

    const lastMessage: FullMessageType | "" = useMemo(() => {
        const messages = data.messages || []
        return messages.length === 0 ? "" : messages[messages.length - 1]
    }, [data])

    const currentUserEmail = useMemo(() => {
        return session?.data?.user?.email
    }, [session])

    const hasSeen = useMemo(() => {
        // no message sent by anyone
        if (!lastMessage) {
            return false;
        }
        const seenArray = lastMessage?.seenBy || []
        if (!currentUserEmail) {
            return false;
        }
        return (seenArray.filter((seenUser) => seenUser.email === currentUserEmail)).length !== 0
    }, [currentUserEmail, lastMessage])

    const lastMessageText = useMemo(() => {
        if (!lastMessage) {
            return `Start your conversation with a message.`
        }
        if (lastMessage?.image) {
            return "Sent an image!"
        }
        if (lastMessage?.body) {
            return lastMessage.body
        }
    }, [lastMessage])

    console.log({
        lastMessage ,
        lastMessageText,
        hasSeen
    })


    return (
        <div className="flex items-center space-x-3  hover:bg-gray-100 transition-all duration-300 p-2 cursor-pointer rounded-xl border-[1px] hover:border-gray-200 border-transparent" onClick={handleClick}>
            <div className="flex items-center space-x-3">
                <AvatarComp user={otherUserData} />
                <div className="flex flex-col">
                    <span className="text-md font-bold text-neutral-950 caption-top">{otherUserData.name}</span>
                    <span className={cn("text-[13px] font-normal text-gray-700 w-[94%]  truncate", !hasSeen && "text-blue-800 font-medium animate-pulse")}>{lastMessageText}</span>
                </div>
            </div>
        </div>
    )
}

export default ConversationItem