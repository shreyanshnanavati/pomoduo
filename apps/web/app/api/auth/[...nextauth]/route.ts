import { prisma } from '@repo/db';
import { compare } from 'bcrypt';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@gmail.io" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) {
          throw new Error("User not found");
        }
        if (!credentials?.password) {
          throw new Error("Password not found");
        }
        const passwordsMatch = await compare(credentials.password, user.password);

        if (!passwordsMatch) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
