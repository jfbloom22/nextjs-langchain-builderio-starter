import type { User } from '@clerk/nextjs/server'
import { prisma } from './db'
import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

export const getUserByClerkId = async (select = { id: true }) => {
  const { userId } = auth()
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId as string,
    },
    select,
  })

  return user
}

export const getUserByClerkIdBearer = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      clerkId: id,
    },
  })

  return user
}

export const syncNewUser = async (clerkUser: User) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  })

  if (!existingUser) {
    const email = clerkUser.emailAddresses[0].emailAddress
    // const { subscriptionId, customerId } = await createAndSubNewCustomer(email)

    await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
      },
    })
  }
}

export const getUserByBearerToken = async (req: NextRequest) => {

 const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
     throw new Error("Authorization header missing or invalid")
  }

  const bearer = authHeader.split(' ')[1];
  const response = await fetch(`${process.env.CLERK_BASE_URL}/oauth/userinfo`, {
    headers: {
      Authorization: `Bearer ${bearer}`,
    },
  });

  if (!response.ok) {
    throw new Error("Authentication failed")
  }

  const user = await response.json();
  if (!user.user_id) {
    throw new Error("Failed getting Clerk user")
  }
  const prismaUser = await getUserByClerkIdBearer(user.user_id)
  // handle prisma user not found by creating them
  if (!prismaUser) {
    return await prisma.user.create({
      data: {
        clerkId: user.user_id,
        email: user.email,
      },
    })
  }
  return prismaUser
}

