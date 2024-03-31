import { FullConversationType, FullMessageType } from '@/shared/types/Conversation'
import React, { useCallback, useMemo } from 'react'
import AvatarComp from '../UI/AvatarComp'
import { useRouter } from 'next13-progressbar'
import { useOtherUser } from '@/shared/hooks/useOtherUser'
import { useSession } from 'next-auth/react'
import { cn } from '@/shared/lib/utils'
import AvatarGroup from '../UI/AvatarGroup'

interface Props {
    data: FullConversationType,
    selected?: boolean
}

const ConversationItem = ({ data, selected }: Props) => {

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

    return (
        <div className="w-full overflow-hidden  grow  flex items-center space-x-3  hover:bg-gray-100 transition-all duration-300 p-2 cursor-pointer rounded-xl border-[1px] hover:border-gray-200 border-transparent " onClick={handleClick}>
            <div className='relative'>
                {
                    data.isGroup ? (
                        <AvatarGroup data={data} />
                    ) : (
                        <AvatarComp user={otherUserData} />
                    )
                }
            </div>
            <div className="grow  flex flex-col truncate pr-3">
                <span className="text-md font-bold text-neutral-950 caption-top">{data.name || otherUserData.name}</span>
                <span className={cn("text-[13px] font-medium text-gray-700 truncate", !hasSeen && "text-blue-700 font-bold animate-pulse")}>{lastMessageText}</span>
            </div>
        </div>
    )
}

export default ConversationItem