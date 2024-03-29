"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next13-progressbar'
import Loading from '../_components/Loading'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

    const [checking, setChecking] = useState(true)
    const session = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session.status === "authenticated") {
            router.push("/users")
        } else if (session.status === "unauthenticated") {
            setChecking(false)
        }
        console.log(session)
    }, [session, router])

    if (checking) {
        return <Loading />
    } else {
        return children
    }
}

export default AuthLayout