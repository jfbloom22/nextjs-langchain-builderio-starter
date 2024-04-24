import {auth} from '@clerk/nextjs'
import {prisma} from './db'
export const getUserByClerkId = async () => {
    const {userId} = auth()
    if (!userId) {
        throw new Error('No userId found')
    }
    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId
        }
    })
    return user
}

