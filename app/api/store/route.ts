import { getUserByClerkId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export const POST = async () => {
    const user = await getUserByClerkId()

    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404})
    }

    const entry = await prisma.store.create({
        data: {
            userId: user.id,
            name: "My Inventory",
            
        }
    })

    revalidatePath('/store')

    return NextResponse.json({data: entry})
    
}