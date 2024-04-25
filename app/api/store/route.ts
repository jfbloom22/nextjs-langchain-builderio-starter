import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { getUserByBearerToken } from "@/utils/auth"

export const POST = async (req: NextRequest) => {
    // const user = await getUserByBearerToken(req)
    const userId = req.headers.get('x-api-key');
    if (!userId) {
        return NextResponse.json({error: 'User not found'}, {status: 404})
    }

    const {name} = await req.json()

    const entry = await prisma.store.create({
        data: {
            userId,
            name,
        }
    })

    revalidatePath('/store')

    return NextResponse.json({data: entry})
    
}