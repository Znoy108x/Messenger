'use client';
import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarProps {
    user?: User;
};

const AvatarComp: React.FC<AvatarProps> = ({ user }) => {

    return (
        <div className="relative">
            <div className="relative inline-block overflow-hidden h-9 w-9 md:size-12 rounded-xl">
                <Image
                    fill
                    src={user?.image || '/placeholder.jpg'}
                    alt="Avatar"
                />
            </div>
            <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0h-2 w-2 md:h-3 md:w-3 animate-pulse duration-500" />
        </div>
    );
}

export default AvatarComp;