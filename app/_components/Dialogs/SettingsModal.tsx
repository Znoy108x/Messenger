"use client"
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from '@/shared/components/ui/button'
import { useRouter } from 'next13-progressbar'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { userUpdateFormSchema, userUpdateFormSchemaType, userUpdateFormSchemaValidation } from '../Forms/user-update-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import Image from 'next/image'
import { Loader } from 'lucide-react'
import { UploadButton } from '@/shared/lib/uploadthing'
import { ErrorNotification, PromiseNotification, SuccessNotification } from '../../../shared/lib/AxiosApiResNotification'
import axios from "axios"

const SettingsModal = ({ onOpenChange, open }: { open: boolean, onOpenChange: () => void }) => {

    const router = useRouter()
    const [sessionLoading, setSessionLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const session = useSession()
    if (!session) {
        router.push("/")
    }

    const userInformationDefaultValues = {
        name: session?.data?.user?.name!,
        image: session?.data?.user?.image!
    }

    const userInfoInputForm = useForm<z.infer<userUpdateFormSchemaType>>({
        resolver: zodResolver(userUpdateFormSchema),
        defaultValues: userInformationDefaultValues
    })

    const onSuccess = () => {
        setIsUpdating(false)
        userInfoInputForm.reset()
        router.refresh()
    }

    async function onSubmit(values: z.infer<userUpdateFormSchemaType>) {
        onOpenChange()
        setIsUpdating(true)
        console.log(values)
        PromiseNotification(
            axios.post("/api/settings", values),
            "Successfully upadated your profile!",
            onSuccess
        )
    }

    useEffect(() => {
        if (session?.status === "authenticated") {
            setSessionLoading(false)
        } else if (session?.status === "unauthenticated") {
            router.push("/")
        }
    }, [session?.status, router])


    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Profile</DialogTitle>
                        <DialogDescription>
                            Edit your profile information
                        </DialogDescription>
                    </DialogHeader>

                    {
                        sessionLoading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <Loader className='animate-spin text-messangerBlue' />
                            </div>
                        ) : (
                            <Form {...userInfoInputForm}>
                                <form onSubmit={userInfoInputForm.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={userInfoInputForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>User Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="please enter your user-name." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={userInfoInputForm.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Image</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center space-x-4">
                                                        <Image className='size-[80px] rounded-full object-cover' width={100} height={100} src={field.value || "/placeholder.jpg"} alt="userimage" />
                                                        <UploadButton
                                                            endpoint="imageUploader"
                                                            onClientUploadComplete={(res) => {
                                                                field.onChange(res[0]?.url)
                                                                SuccessNotification("Image Uploaded")
                                                            }}
                                                            onUploadError={(error: Error) => {
                                                                ErrorNotification(`ERROR! ${error.message}`)
                                                            }}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex items-center w-full space-x-3">
                                        <Button variant={"outline"} onClick={() => {
                                            userInfoInputForm.reset()
                                            onOpenChange()
                                        }} className='w-1/2'>Cancel</Button>
                                        <Button type="submit" className='w-1/2 bg-messangerBlue hover:bg-messangerBlue'>Submit</Button>
                                    </div>
                                </form>
                            </Form>
                        )
                    }

                </DialogContent>
            </Dialog>
        </>
    )
}

export default SettingsModal