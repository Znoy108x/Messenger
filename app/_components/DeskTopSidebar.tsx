"use client"
import { useRoute } from '@/shared/hooks/useRoute'
import React, { useState } from 'react'
import DeskTopItem from './DeskTopItem'

const DeskTopSidebar = () => {

    const routes = useRoute()
    const [isOpen, setOpen] = useState(false)

    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
            <nav className="mt-4 flex flex-col justify-between">
                <ul
                    role='list'
                    className='flex flex-col items-center space-y-1'>
                    {
                        routes.map((item) => (
                            <DeskTopItem key={item.label} {...item} />
                        ))
                    }
                </ul>
            </nav>
        </div>
    )
}

export default DeskTopSidebar