"use server"
import { NextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const getSession = async ()=>{
    return await getServerSession(NextAuthOptions)
}