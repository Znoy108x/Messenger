import { getCurrentUser } from "@/shared/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prismadb";

interface ParamsType {
  conversationId: string;
}

export async function POST(
  req: NextRequest,
  { params: { conversationId } }: { params: ParamsType }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("You are not authenticated", { status: 400 });
    }
    const conversationWithMessageAndUser = await prisma.conversation.findUnique(
      {
        where: {
          id: conversationId,
        },
        include: {
          messages: {
            include: {
              seenBy: true,
            },
          },
          users: true,
        },
      }
    );
    if (!conversationWithMessageAndUser) {
      return new NextResponse("Invalid conversation id", { status: 400 });
    }
    const totalMessages = conversationWithMessageAndUser.messages.length - 1;
    const lastMessage = conversationWithMessageAndUser.messages[totalMessages];
    if (!lastMessage) {
      return NextResponse.json(conversationWithMessageAndUser);
    }
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        seenBy: true,
        sender: true,
      },
      data: {
        seenBy: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });
    return NextResponse.json(updatedMessage);
  } catch (err) {
    console.log("Conversationd-Seen-err");
    return new NextResponse("Something went wrong!", { status: 501 });
  }
}
