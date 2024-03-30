"use client"
import { useActiveChannel } from '@/shared/hooks/useActiveChannel'

const ActiveStatus = () => {
    useActiveChannel()
    return null
}

export default ActiveStatus