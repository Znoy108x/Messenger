"use client"
import { FullConversationType } from '@/shared/types/Conversation'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { chatInputFormSchema, chatInputFormSchemaType, chatInputFormSchemaValidation } from '../Forms/chat-input-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import axios from 'axios'
import { Button } from '@/shared/components/ui/button'
import { ImageUp, SendHorizontal } from 'lucide-react'
import { CldUploadButton } from "next-cloudinary"

const ConversationForm = ({ conversation }: { conversation: FullConversationType }) => {

    const [render, setRender] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null);

    const chatInputFormDefaultValue = {
        body: "",
    }

    const chatInputForm = useForm<z.infer<chatInputFormSchemaType>>({
        resolver: zodResolver(chatInputFormSchema),
        defaultValues: chatInputFormDefaultValue
    })

    async function onSubmit(values: z.infer<chatInputFormSchemaType>) {
        chatInputForm.reset()
        try {
            await axios.post("/api/messages", { ...values, conversationId: conversation.id })
        } catch (err) {
            console.log("User-Input-Send", err)
        }
    }

    const handleImageUpload = async (result: any) => {
        const imageUrl = result?.info?.secure_url
        await axios.post("/api/messages", {
            image: imageUrl,
            conversationId: conversation.id
        })
    }

    useEffect(() => {
        setRender(true)
    }, [])

    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef?.current.focus();
        }
    }, [inputRef]);

    if (!render) return null

    return (
        <div className="w-full  bg-white py-4 pl-3 gap-x-4 flex items-start">
            <CldUploadButton options={{ maxFiles: 1 }} uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!} onSuccess={handleImageUpload}>
                <Button variant={"ghost"} className='bg-messangerBlue hover:bg-messangerBlue'>
                    <ImageUp className="size-7 text-white" />
                </Button>
            </CldUploadButton>
            <Form {...chatInputForm}>
                <form onSubmit={chatInputForm.handleSubmit(onSubmit)} className='flex-1 flex items-start gap-x-4 pr-4'>
                    <FormField
                        control={chatInputForm.control}
                        name="body"
                        render={({ field }) => (
                            <FormItem className='grow'>
                                <FormControl>
                                    <Input placeholder="Send message!" {...field} className='flex-1 focus-visible:ring-messangerBlue' ref={inputRef} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button variant={"ghost"} className='bg-messangerBlue hover:bg-messangerBlue'>
                        <SendHorizontal className="text-white size-6" />
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default ConversationForm