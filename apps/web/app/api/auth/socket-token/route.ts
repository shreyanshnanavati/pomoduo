import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Generate a JWT token with user information
    const token = jwt.sign(
      { 
        userId: session.user.id,
        name: session.user.name
      },
      process.env.NEXTAUTH_SECRET || '',
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating socket token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 