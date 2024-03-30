'use client';
import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarProps {
    user?: User;
};

const AvatarComp: React.FC<AvatarProps> = ({ user }) => {

    return (
        <div className="shrink-0 relative overflow-hidden size-10 md:size-12 rounded-xl">
            <Image
                fill
                src={user?.image || '/placeholder.jpg'}
                alt="Avatar"
                className="object-cover"
            />
        </div>
    );
}

export default AvatarComp;