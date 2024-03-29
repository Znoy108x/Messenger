import { getCurrentUser } from "@/shared/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prismadb";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser?.email) {
      return new NextResponse("You are not authenticated!", { status: 400 });
    }
    const { body, conversationId, image } = await req.json();

    if (!conversationId) {
      return new NextResponse("ConversationId is missing!", {
        status: 400,
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        body,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seenBy: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seenBy: true,
        sender: true,
      },
    });

    const newUpdatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
    });

    return NextResponse.json(newMessage);
  } catch (err) {
    console.log("Messages-Err", err);
    return new NextResponse("Something went wrong!", { status: 501 });
  }
}
