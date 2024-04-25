import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { getUserByBearerToken, getUserByClerkIdBearer } from "@/utils/auth"

export const POST = async (req: NextRequest) => {
    const user = await getUserByBearerToken(req)
    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404})
    }

    const {name} = await req.json()

    const entry = await prisma.store.create({
        data: {
            userId: user.id,
            name,
        }
    })

    revalidatePath('/store')

    return NextResponse.json({data: entry})
    
}