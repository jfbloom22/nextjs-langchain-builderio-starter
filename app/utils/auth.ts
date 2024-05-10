import { prisma } from './db'
import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { ClerkUser } from '@/types/types'
import NodeCache from 'node-cache'
import { User } from '@prisma/client'

const tokenCache = new NodeCache({ stdTTL: 3600 })
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

// export const syncNewUser = async (clerkUser: ClerkUser) => {
//   const existingUser = await prisma.user.findUnique({
//     where: {
//       clerkId: clerkUser.id,
//     },
//   })

//   if (!existingUser) {
//     const email = clerkUser.emailAddresses[0].emailAddress
//     // const { subscriptionId, customerId } = await createAndSubNewCustomer(email)

//     await prisma.user.create({
//       data: {
//         clerkId: clerkUser.id,
//         email,
//       },
//     })
//   }
// }

export const getUserByBearerToken = async (req: NextRequest): Promise<User> => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("Authorization header missing or invalid");
  }

  const bearerToken = authHeader.split(' ')[1];
  const cachedUser = tokenCache.get<User>(bearerToken);
  if (cachedUser) {
    return cachedUser;
  }
  const clerkUser = await fetchClerkUser(bearerToken);
  const user = await getOrCreateUser(clerkUser);
  tokenCache.set(bearerToken, user);
  return user;
}

async function fetchClerkUser(bearerToken: string): Promise<ClerkUser> {
  const clerkBaseUrl = process.env.CLERK_BASE_URL;
  const response = await fetch(`${clerkBaseUrl}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });

  if (!response.ok) {
    throw new Error("Authentication failed with status: " + response.status);
  }

  const userData = await response.json();
  if (!userData.user_id) {
    throw new Error("Failed getting Clerk user data");
  }

  return userData;
}

async function getOrCreateUser(clerkUser: ClerkUser): Promise<User> {
  const prismaUser = await getUserByClerkIdBearer(clerkUser.user_id);
  if (!prismaUser) {
    return await prisma.user.create({
      data: {
        clerkId: clerkUser.user_id,
        email: clerkUser.email,
      },
    });
  }
  return prismaUser;
}

