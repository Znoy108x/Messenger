"use client"
import { FullConversationType } from '@/shared/types/Conversation'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { chatInputFormSchema, chatInputFormSchemaType, chatInputFormSchemaValidation } from './Forms/chat-input-form'
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

const ConversationForm = ({ conversation }: { conversation: FullConversationType }) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const chatInputFormDefaultValue = {
        body: "",
    }

    const chatInputForm = useForm<z.infer<chatInputFormSchemaType>>({
        resolver: zodResolver(chatInputFormSchema),
        defaultValues: chatInputFormDefaultValue
    })

    async function onSubmit(values: z.infer<chatInputFormSchemaType>) {
        await axios.post("/api/messages", { ...values, conversationId: conversation.id })
        chatInputForm.reset()
    }


    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef?.current.focus();
        }
    }, [inputRef]);

    return (
        <div className="w-full  bg-white py-4 pl-3 gap-x-4 flex items-center">
            <Button variant={"ghost"} className='bg-messangerBlue hover:bg-messangerBlue'>
                <ImageUp className="size-7 text-white" />
            </Button>
            <Form {...chatInputForm}>
                <form onSubmit={chatInputForm.handleSubmit(onSubmit)} className='flex-1 flex items-center gap-x-4 pr-4'>
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