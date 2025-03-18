import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { hash } from 'bcrypt';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  console.log(name,email,password);
  

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return NextResponse.json({ user });
}