import { z } from "zod";

export const chatInputFormSchemaValidation = {
  body: z.string().min(1, {
    message: "You cannot send empty message!",
  }),
};

export const chatInputFormSchema = z.object(chatInputFormSchemaValidation);

export type chatInputFormSchemaType = typeof chatInputFormSchema;
