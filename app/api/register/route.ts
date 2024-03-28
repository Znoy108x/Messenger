import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/shared/lib/prismadb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password } = body;
    if (!email || !name || !password) {
      return new NextResponse("Missing Info", { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const isAlreadyPresent = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (isAlreadyPresent) {
      return new NextResponse(
        "User with this email is already present, please use other email address!",
        { status: 400 }
      );
    }
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
    return NextResponse.json(user);
  } catch (err) {
    console.log("USER-REGISTER-ERR", err);
    return new NextResponse("Something went wrong!", {
      status: 501,
    });
  }
}